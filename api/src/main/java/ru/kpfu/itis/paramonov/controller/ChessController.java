package ru.kpfu.itis.paramonov.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import ru.kpfu.itis.paramonov.dto.chess.request.*;
import ru.kpfu.itis.paramonov.dto.chess.response.*;
import ru.kpfu.itis.paramonov.service.ChessApiService;
import ru.kpfu.itis.paramonov.utils.chess.ChessGameStore;
import ru.kpfu.itis.paramonov.utils.chess.ChessTimer;

import java.util.*;

@RequiredArgsConstructor
@Controller
public class ChessController {
    private final SimpMessagingTemplate messagingTemplate;

    private final ChessGameStore chessGameStore;

    private final List<Integer> queue = new ArrayList<>();

    private final Map<Integer, Thread> seekGameThreads = new HashMap<>();

    private final Random rand = new Random();

    private final ChessApiService chessApiService;

    @MessageMapping("/game/seek")
    public void processSeekRequest(SeekGameRequestDto seekGameRequestDto, StompHeaderAccessor headerAccessor) {
        Integer id = seekGameRequestDto.getFrom();
        if (queue.contains(id) || id == null) return;
        headerAccessor.getSessionAttributes().put("id", id);
        queue.add(id);
        seekGame(id);
    }

    @MessageMapping("/game/seek/cancel")
    public void processCancelSeekRequest(CancelSeekGameRequestDto cancelSeekGameRequestDto) {
        Integer id = cancelSeekGameRequestDto.getFrom();
        Thread seekThread = seekGameThreads.get(id);
        if (seekThread != null) seekThread.interrupt();
    }

    @MessageMapping("/game/move")
    public void processMoveRequest(MoveRequestDto moveRequestDto) {
        ChessGameStore.ChessGame game = chessGameStore.get(moveRequestDto.getGameId());
        if (game == null) {
            cancelGame(moveRequestDto.getFromUser());
            return;
        }

        chessApiService.validateMove(
                moveRequestDto.getFrom(), moveRequestDto.getTo(), moveRequestDto.getColor(),
                game.getTurn(), game.getFen(), moveRequestDto.getPromotion()
        ).doOnNext(response -> {
            if (response.isValid()) {
                game.setFen(response.getFen());
                game.setTurn(response.getTurn());
                if ("white".equals(moveRequestDto.getColor())) {
                    game.getWhiteTimer().stop();
                    if (!game.getBlackTimer().isRunning()) game.getBlackTimer().start();
                    else game.getBlackTimer().resume();
                } else {
                    game.getBlackTimer().stop();
                    game.getWhiteTimer().resume();
                }
                ChessMoveResponseDto moveResponse = new ChessMoveResponseDto(
                        "MOVE", true, response.getTurn(),
                        response.getFen(), response.getError()
                );
                sendMessageToUser(game.getBlack(), moveResponse);
                sendMessageToUser(game.getWhite(), moveResponse);

                if (response.getResult() != null) {
                    switch (response.getResult()) {
                        case "win":
                            onWin(game, moveRequestDto.getFromUser());
                            break;
                        case "insufficient":
                        case "stalemate":
                        case "draw":
                            onDraw(game, response.getResult());
                            break;
                    }
                }

            } else {
                sendMessageToUser(
                        moveRequestDto.getFromUser(),
                        new ChessMoveResponseDto("MOVE", false, null, null, response.getError())
                );
            }
        }).subscribe();
    }

    @MessageMapping("/game/concede")
    public void processConcedeRequest(ConcedeRequestDto concedeRequestDto) {
        ChessGameStore.ChessGame game = chessGameStore.get(concedeRequestDto.getGameId());
        if (game == null) cancelGame(concedeRequestDto.getFrom());
        else {
            switch (concedeRequestDto.getReason()) {
                case "disconnect":
                    onPlayerDisconnected(game, concedeRequestDto);
                    break;
                case "concede":
                    onPlayerConceded(game, concedeRequestDto);
                    break;
            }
        }
    }

    private void onPlayerConceded(ChessGameStore.ChessGame game, ConcedeRequestDto concedeRequestDto) {
        Integer other;
        if (concedeRequestDto.getFrom().equals(game.getWhite())) other = game.getBlack();
        else other = game.getWhite();

        sendMessageToUser(concedeRequestDto.getFrom(), new ChessConcedeResponseDto(
                "CONCEDE", "concede", true
        ));
        sendMessageToUser(other, new ChessConcedeResponseDto(
                "CONCEDE", "concede", false
        ));
        chessGameStore.endGame(game.getId());
    }

    private void onPlayerDisconnected(ChessGameStore.ChessGame game, ConcedeRequestDto concedeRequestDto) {
        Integer other;
        if (concedeRequestDto.getFrom().equals(game.getWhite())) other = game.getBlack();
        else other = game.getWhite();
        sendMessageToUser(other, new ChessConcedeResponseDto(
                "CONCEDE", "disconnect", false
        ));
        chessGameStore.endGame(game.getId());
    }

    private void onWin(ChessGameStore.ChessGame game, Integer from) {
        sendMessageToUser(from, new ChessEndResponseDto("END", "win"));

        if (from.equals(game.getWhite()))
            sendMessageToUser(game.getBlack(), new ChessEndResponseDto("END", "lose"));
        else sendMessageToUser(game.getWhite(), new ChessEndResponseDto("END", "lose"));

        chessGameStore.endGame(game.getId());
    }

    private void onDraw(ChessGameStore.ChessGame game, String result) {
        sendMessageToUser(game.getWhite(), new ChessEndResponseDto("END", result));
        sendMessageToUser(game.getBlack(), new ChessEndResponseDto("END", result));

        chessGameStore.endGame(game.getId());
    }

    private static final long MAX_WAIT_TIME_MILLIS = 600 * 1000L;

    private void seekGame(Integer id) {
        Runnable seekTask = () -> {
            try {
                long time = 0;
                while(true) {
                    if (time > MAX_WAIT_TIME_MILLIS) {
                        sendCancelGameSeek(id);
                        break;
                    }
                    synchronized (queue) {
                        if (!queue.isEmpty() && queue.contains(id)) {
                            int random = rand.nextInt(queue.size());
                            Integer other = queue.get(random);
                            if (!other.equals(id)) {
                                queue.remove(other);
                                queue.remove(id);
                                sendGameBegin(id, other);
                                break;
                            }
                        } else if (!queue.contains(id)) break;
                    }
                    Thread.sleep(200L);
                    time += 200L;
                }
            } catch (InterruptedException e) {
                queue.remove(id);
                sendCancelGameSeek(id);
            }
        };
        Thread thread = new Thread(seekTask);
        seekGameThreads.put(id, thread);
        thread.start();
    }
    private void sendGameBegin(Integer player1, Integer player2) {
        double random = rand.nextDouble();
        Integer white;
        Integer black;
        String player1Color;
        String player2Color;

        if (random < 0.5) {
            player1Color = "white";
            white = player1;
            player2Color = "black";
            black = player2;
        }
        else {
            player2Color = "white";
            white = player2;
            player1Color = "black";
            black = player1;
        }
        String gameId = player1 + "-" + player2;
        ChessGameStore.ChessGame game = new ChessGameStore.ChessGame(gameId, white, black);
        chessGameStore.add(game);
        chessGameStore.addPlayerDisconnectedListener(white, blackId -> {
            chessGameStore.endGame(game.getId());
            sendMessageToUser(blackId, new ChessConcedeResponseDto(
                    "CONCEDE", "disconnect", false
            ));
        });
        chessGameStore.addPlayerDisconnectedListener(black, whiteId -> {
            chessGameStore.endGame(game.getId());
            sendMessageToUser(whiteId, new ChessConcedeResponseDto(
                    "CONCEDE", "disconnect", false
            ));
        });

        sendMessageToUser(player1, new ChessBeginResponseDto(
                "BEGIN", player1Color, player2, gameId, ChessGameStore.ChessGame.INITIAL_FEN
        ));
        sendMessageToUser(player2, new ChessBeginResponseDto(
                "BEGIN", player2Color, player1, gameId, ChessGameStore.ChessGame.INITIAL_FEN
        ));

        game.setWhiteTimer(new ChessTimer(() -> {
            game.setWhiteTime(game.getWhiteTime() - 1000L);
            if (game.getWhiteTime() < 0)
                onTimeRanOut(game.getBlack(), game.getWhite(), game);
            else sendTimeData(game);
        }, 1000L));

        game.setBlackTimer(new ChessTimer(() -> {
            game.setBlackTime(game.getBlackTime() - 1000L);
            if (game.getBlackTime() < 0)
                onTimeRanOut(game.getWhite(), game.getBlack(), game);
            else sendTimeData(game);
        }, 1000L));
        game.getWhiteTimer().start();
    }

    private void onTimeRanOut(Integer winner, Integer loser, ChessGameStore.ChessGame game) {
        sendMessageToUser(loser, new ChessEndResponseDto("END", "lose_time"));
        sendMessageToUser(winner, new ChessEndResponseDto("END", "win_time"));

        chessGameStore.endGame(game.getId());
    }

    private void sendTimeData(ChessGameStore.ChessGame chessGame) {
        sendMessageToUser(chessGame.getWhite(), new ChessTimeResponseDto(
                "TIME",
                chessGame.getWhiteTime().intValue() / 1000,
                chessGame.getBlackTime().intValue() / 1000));
        sendMessageToUser(chessGame.getBlack(), new ChessTimeResponseDto(
                "TIME",
                chessGame.getBlackTime().intValue() / 1000,
                chessGame.getWhiteTime().intValue() / 1000));
    }

    private void cancelGame(Integer playerId) {
        sendMessageToUser(playerId, new ChessCancelGameResponseDto("OMIT", "The game does not exist"));
    }

    private void sendCancelGameSeek(Integer playerId) {
        sendMessageToUser(playerId, new ChessCancelGameSeekResponseDto("CANCEL_SEARCH"));
    }

    private void sendMessageToUser(Integer playerId, Object payload) {
        messagingTemplate.convertAndSendToUser(
                playerId.toString(), "/queue/messages", payload
        );
    }
}
