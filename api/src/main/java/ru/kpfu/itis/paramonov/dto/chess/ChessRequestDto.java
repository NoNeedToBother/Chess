package ru.kpfu.itis.paramonov.dto.chess;

import lombok.Getter;

@Getter
public class ChessRequestDto {

    private String action;

    private String moveFrom;

    private String moveTo;

    private Integer from;

    private String gameId;

    private String promotion;

    private String color;

    private String fen;
}
