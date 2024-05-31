package ru.kpfu.itis.paramonov.dto.chess;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChessIncorrectMoveResponseDto {

    private String action;

    private String fen;
}
