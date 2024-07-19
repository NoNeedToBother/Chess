package ru.kpfu.itis.paramonov.dto.chess.request;

import lombok.Getter;

@Getter
public class EndGameRequestDto {

    private Integer from;

    private String gameId;

    private String result;

    private String fen;

}
