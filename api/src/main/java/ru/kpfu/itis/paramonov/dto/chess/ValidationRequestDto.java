package ru.kpfu.itis.paramonov.dto.chess;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ValidationRequestDto {

    @JsonProperty("from")
    private String from;

    @JsonProperty("to")
    private String to;

    @JsonProperty("color")
    private String color;

    @JsonProperty("turn")
    private String turn;

    @JsonProperty("fen")
    private String fen;

    @JsonProperty("promotion")
    private String promotion;
}
