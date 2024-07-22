package ru.kpfu.itis.paramonov.dto.chess;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ChessTimeResponseDto {

    private String action;

    private Integer time;

    private Integer opponentTime;
}
