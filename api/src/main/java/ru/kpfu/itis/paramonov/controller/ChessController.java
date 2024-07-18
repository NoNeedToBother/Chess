package ru.kpfu.itis.paramonov.controller;

import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.kpfu.itis.paramonov.dto.chess.*;

import java.util.*;

@RequiredArgsConstructor
@Controller
public class ChessController {
    private final SimpMessagingTemplate messagingTemplate;

    private final Map<String, ChessGame> games = new HashMap<>();

    private final List<Integer> queue = new ArrayList<>();

    private final Random rand = new Random();

    @MessageMapping("/game")
    public void processRequest(ChessRequestDto requestData) {
        switch (requestData.getAction()) {
            case "SEEK":
                onSeek(requestData.getFrom());
                break;
            case "MOVE":
                onMove(requestData);
                break;
            case "END":
                onEnd(requestData);
                break;
        }
    }

    private void onEnd(ChessRequestDto data) {
        ChessGame game = games.get(data.getGameId());
        if (game == null) sendGameDataErrorAndOmitGame(data.getFrom());
        else {
            switch (data.getResult()) {
                case "win":
                    onWin(game, data);
                    break;
                case "insufficient":
                case "stalemate":
                case "draw":
                    onDraw(game, data);
                    break;
            }
        }
    }

    private void onWin(ChessGame game, ChessRequestDto requestData) {
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

    private void onDraw(ChessGame game, ChessRequestDto requestData) {
        sendMessageToUser(game.white, new ChessEndResponseDto(
                "END", requestData.getResult(), requestData.getFen()
        ));
        sendMessageToUser(game.black, new ChessEndResponseDto(
                "END", requestData.getResult(), requestData.getFen()
        ));
    }

    private void onMove(ChessRequestDto data) {
        ChessGame game = games.get(data.getGameId());
        if (game == null) sendGameDataErrorAndOmitGame(data.getFrom());
        else {
            String fen = data.getFen();
            game.setFen(fen);
            if ("white".equals(data.getColor())) game.setTurn("black");
            else game.setTurn("white");
            sendMessageToUser(game.white, new ChessMoveResponseDto(
                    "MOVE", game.turn, game.fen
            ));
            sendMessageToUser(game.black, new ChessMoveResponseDto(
                    "MOVE", game.turn, game.fen
            ));
        }
    }

    /*private void sendMoveErrorMessage(Integer playerId) {
        sendMessageToUser();
    }*/

    private void onSeek(Integer id) {
        if (queue.contains(id)) return;
        queue.add(id);
        seekGame(id);
    }

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
