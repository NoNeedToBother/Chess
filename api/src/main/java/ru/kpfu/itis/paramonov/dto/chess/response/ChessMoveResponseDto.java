package ru.kpfu.itis.paramonov.dto.chess.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChessMoveResponseDto {

    private String action;

    private boolean valid;

    private String turn;

    private String fen;

    private String error;

}
