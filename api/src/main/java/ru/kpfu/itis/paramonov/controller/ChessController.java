package ru.kpfu.itis.paramonov.controller;

import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.kpfu.itis.paramonov.dto.chess.*;
import ru.kpfu.itis.paramonov.dto.chess.request.ConcedeRequestDto;
import ru.kpfu.itis.paramonov.dto.chess.request.EndGameRequestDto;
import ru.kpfu.itis.paramonov.dto.chess.request.MoveRequestDto;
import ru.kpfu.itis.paramonov.dto.chess.request.SeekGameRequestDto;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Controller
public class ChessController {
    private final SimpMessagingTemplate messagingTemplate;

    private final Map<String, ChessGame> games = new HashMap<>();

    private final List<Integer> queue = new ArrayList<>();

    private final Random rand = new Random();

    @MessageMapping("/game/seek")
    public void processSeekRequest(SeekGameRequestDto seekGameRequestDto) {
        Integer id = seekGameRequestDto.getFrom();
        if (queue.contains(id) || id == null) return;
        queue.add(id);
        seekGame(id);
    }

    @MessageMapping("/game/move")
    public void processMoveRequest(MoveRequestDto moveRequestDto) {
        ChessGame game = games.get(moveRequestDto.getGameId());
        if (game == null) sendGameDataErrorAndOmitGame(moveRequestDto.getFrom());
        else {
            String fen = moveRequestDto.getFen();
            game.setFen(fen);
            if ("white".equals(moveRequestDto.getColor())) game.setTurn("black");
            else game.setTurn("white");
            sendMessageToUser(game.white, new ChessMoveResponseDto(
                    "MOVE", game.turn, game.fen
            ));
            sendMessageToUser(game.black, new ChessMoveResponseDto(
                    "MOVE", game.turn, game.fen
            ));
        }
    }

    @MessageMapping("/game/end")
    public void processEndGame(EndGameRequestDto endGameRequestDto) {
        ChessGame game = games.get(endGameRequestDto.getGameId());
        if (game == null) sendGameDataErrorAndOmitGame(endGameRequestDto.getFrom());
        else {
            switch (endGameRequestDto.getResult()) {
                case "win":
                    onWin(game, endGameRequestDto);
                    break;
                case "insufficient":
                case "stalemate":
                case "draw":
                    onDraw(game, endGameRequestDto);
                    break;
            }
        }
    }

    @MessageMapping("/game/concede")
    public void processConcedeRequest(ConcedeRequestDto concedeRequestDto) {
        ChessGame game = games.get(concedeRequestDto.getGameId());
        if (game == null) sendGameDataErrorAndOmitGame(concedeRequestDto.getFrom());
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

    private void onPlayerConceded(ChessGame game, ConcedeRequestDto concedeRequestDto) {
        Integer other;
        if (concedeRequestDto.getFrom().equals(game.white)) other = game.black;
        else other = game.white;


        sendMessageToUser(concedeRequestDto.getFrom(), new ChessConcedeResponseDto(
                "CONCEDE", "concede", true
        ));
        sendMessageToUser(other, new ChessConcedeResponseDto(
                "CONCEDE", "concede", false
        ));
    }

    private void onPlayerDisconnected(ChessGame game, ConcedeRequestDto concedeRequestDto) {
        Integer other;
        if (concedeRequestDto.getFrom().equals(game.white)) other = game.black;
        else other = game.white;
        sendMessageToUser(other, new ChessConcedeResponseDto(
                "CONCEDE", "disconnect", false
        ));
    }

    private void onWin(ChessGame game, EndGameRequestDto requestData) {
        sendMessageToUser(requestData.getFrom(), new ChessEndResponseDto(
                "END", "win", requestData.getFen()
        ));
        if (requestData.getFrom().equals(game.white)) {
            sendMessageToUser(game.black, new ChessEndResponseDto(
                    "END", "lose", requestData.getFen()
            ));
        } else sendMessageToUser(game.white, new ChessEndResponseDto(
                "END", "lose", requestData.getFen()
        ));
    }

    private void onDraw(ChessGame game, EndGameRequestDto requestData) {
        sendMessageToUser(game.white, new ChessEndResponseDto(
                "END", requestData.getResult(), requestData.getFen()
        ));
        sendMessageToUser(game.black, new ChessEndResponseDto(
                "END", requestData.getResult(), requestData.getFen()
        ));
    }

    /*private void sendMoveErrorMessage(Integer playerId) {
        sendMessageToUser();
    }*/

    private static final long MAX_WAIT_TIME_MILLIS = 600 * 1000L;

    private void seekGame(Integer id) {
        Runnable seekTask = () -> {
            long time = 0;
            while(true) {
                if (time > MAX_WAIT_TIME_MILLIS) {
                    sendCancelGame(id);
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
                try {
                    Thread.sleep(200L);
                    time += 200L;
                } catch (InterruptedException ignored) {}
            }
        };
        Thread thread = new Thread(seekTask);
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
        games.put(gameId, new ChessGame(gameId, white, black));

        sendMessageToUser(player1, new ChessBeginResponseDto(
                "BEGIN", player1Color, player2, gameId, ChessGame.INITIAL_FEN
        ));
        sendMessageToUser(player2, new ChessBeginResponseDto(
                "BEGIN", player2Color, player1, gameId, ChessGame.INITIAL_FEN
        ));
    }

    private void sendGameDataErrorAndOmitGame(Integer playerId) {
        sendMessageToUser(playerId, new ChessOmitGameResponseDto("OMIT", "The game does not exist"));
    }

    private void sendCancelGame(Integer playerId) {
        sendMessageToUser(playerId, new ChessCancelGameSearchResponseDto("CANCEL_SEARCH"));
    }

    private void sendMessageToUser(Integer playerId, Object payload) {
        messagingTemplate.convertAndSendToUser(
                playerId.toString(), "/queue/messages", payload
        );
    }

    @RequiredArgsConstructor
    @Setter
    private static class ChessGame {
        private final String id;

        private final Integer white;

        private final Integer black;

        private String fen = INITIAL_FEN;

        private String turn = "white";

        private static final String INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

}
