package ru.kpfu.itis.paramonov.dto.chess.api.lichess;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DailyPuzzleInfoPuzzleResultDto {

    private Integer rating;

    private List<String> solution;

    private List<String> themes;

}
