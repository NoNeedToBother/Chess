package ru.kpfu.itis.paramonov.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
public class ChessGameStore {

    private final Map<String, ChessGame> games = new HashMap<>();

    private final Map<Integer, PlayerDisconnectedListener> playerDisconnectedListeners = new HashMap<>();

    public ChessGame get(String id) {
        return games.get(id);
    }

    public void add(ChessGame game) {
        games.put(game.id, game);
    }

    public void remove(String id) {
        games.remove(id);
    }

    public void notifyPlayerDisconnected(Integer disconnectedId) {
        PlayerDisconnectedListener listener = playerDisconnectedListeners.get(disconnectedId);
        games.values().stream()
                        .filter(game ->
                                Objects.equals(game.black, disconnectedId) || Objects.equals(game.white, disconnectedId))
                        .forEach(game -> {
                            if (Objects.equals(game.black, disconnectedId)) listener.onPlayerDisconnected(game.white);
                            else listener.onPlayerDisconnected(game.black);
                        });
        playerDisconnectedListeners.remove(disconnectedId);
    }

    public void addPlayerDisconnectedListener(Integer subscribeOn, PlayerDisconnectedListener listener) {
        playerDisconnectedListeners.put(subscribeOn, listener);
    }

    @FunctionalInterface public interface PlayerDisconnectedListener {
        void onPlayerDisconnected(Integer id);
    }

    @RequiredArgsConstructor
    @Setter
    @Getter
    public static class ChessGame {
        private final String id;

        private final Integer white;

        private final Integer black;

        private String fen = INITIAL_FEN;

        private String turn = "white";

        public static final String INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
}
