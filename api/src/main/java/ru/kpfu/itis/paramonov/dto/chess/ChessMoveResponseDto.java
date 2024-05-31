package ru.kpfu.itis.paramonov.dto.chess;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChessMoveResponseDto {

    private String action;

    private String turn;

    private String fen;

}
