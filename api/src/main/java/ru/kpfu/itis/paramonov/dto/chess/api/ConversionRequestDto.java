package ru.kpfu.itis.paramonov.dto.chess.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConversionRequestDto {

    @JsonProperty("pgn")
    private String pgn;
}
