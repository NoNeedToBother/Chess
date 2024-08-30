package ru.kpfu.itis.paramonov.dto.chess;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationResultDto {

    @JsonProperty(required = true)
    private boolean valid;

    private String fen;

    private String turn;

    private String result;

    private String error;
}
