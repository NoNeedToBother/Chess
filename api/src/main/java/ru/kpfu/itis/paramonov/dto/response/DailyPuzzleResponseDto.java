package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class DailyPuzzleResponseDto extends BaseResponseDto {

    @JsonProperty("fen")
    private String fen;

    @JsonProperty("rating")
    private Integer rating;

    @JsonProperty("solution")
    private List<String> solution;

    @JsonProperty("themes")
    private List<String> themes;
}
