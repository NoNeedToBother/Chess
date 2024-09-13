package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import ru.kpfu.itis.paramonov.dto.chess.PuzzleDto;

@AllArgsConstructor
public class DailyPuzzleResponseDto extends BaseResponseDto {

    @JsonProperty("puzzle")
    private PuzzleDto puzzle;
}
