package ru.kpfu.itis.paramonov.dto.chess.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ChessCancelGameResponseDto {

    private String action;

    private String error;

}
