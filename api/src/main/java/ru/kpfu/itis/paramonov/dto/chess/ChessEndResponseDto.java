package ru.kpfu.itis.paramonov.dto.chess;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChessEndResponseDto {

    private String action;

    private String result;

    private String fen;
}
