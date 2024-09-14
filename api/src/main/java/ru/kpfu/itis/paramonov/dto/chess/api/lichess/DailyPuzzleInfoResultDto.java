package ru.kpfu.itis.paramonov.dto.chess.api.lichess;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyPuzzleInfoResultDto {

    DailyPuzzleInfoGameResultDto game;

    DailyPuzzleInfoPuzzleResultDto puzzle;

}
