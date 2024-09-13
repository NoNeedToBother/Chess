package ru.kpfu.itis.paramonov.service;

import reactor.core.publisher.Mono;
import ru.kpfu.itis.paramonov.dto.chess.api.ConversionResultDto;
import ru.kpfu.itis.paramonov.dto.chess.api.ValidationResultDto;
import ru.kpfu.itis.paramonov.dto.chess.api.lichess.DailyPuzzleInfoResultDto;

public interface ChessApiService {

    Mono<ValidationResultDto> validateMove(String from, String to, String color, String turn, String fen, String promotion);

    Mono<ConversionResultDto> convertPgnToFen(String pgn);

    Mono<DailyPuzzleInfoResultDto> getDailyPuzzle();
}
