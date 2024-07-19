package ru.kpfu.itis.paramonov.dto.chess.request;

import lombok.Getter;

@Getter
public class MoveRequestDto {

    private Integer from;

    private String gameId;

    private String promotion;

    private String color;

    private String fen;

}
