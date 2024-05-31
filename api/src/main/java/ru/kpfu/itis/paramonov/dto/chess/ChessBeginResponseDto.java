package ru.kpfu.itis.paramonov.dto.chess;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ChessBeginResponseDto {

    private String action;

    private String color;

    private Integer opponent;

    private String gameId;

    private String fen;
}
