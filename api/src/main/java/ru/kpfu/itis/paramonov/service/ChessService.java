package ru.kpfu.itis.paramonov.service;

import reactor.core.publisher.Mono;
import ru.kpfu.itis.paramonov.dto.chess.ValidationResultDto;

public interface ChessService {

    Mono<ValidationResultDto> validateMove(String from, String to, String color, String turn, String fen, String promotion);

}
