package ru.kpfu.itis.paramonov.dto.chess;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ChessConcedeResponseDto {

    private String action;

    private String reason;

    private boolean conceded;
}
