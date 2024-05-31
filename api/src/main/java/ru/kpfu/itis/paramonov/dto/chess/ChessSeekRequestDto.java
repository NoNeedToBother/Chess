package ru.kpfu.itis.paramonov.dto.chess;

import lombok.Getter;

@Getter
public class ChessSeekRequestDto {
    private String action;
    private Long from;
}
