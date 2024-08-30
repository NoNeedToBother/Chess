package ru.kpfu.itis.paramonov.dto.chess.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class ChessMoveResponseDto {

    private String action;

    private boolean valid;

    private String turn;

    private String fen;

    private String result;

    private String error;

}
