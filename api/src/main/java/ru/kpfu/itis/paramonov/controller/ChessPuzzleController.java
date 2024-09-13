package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import ru.kpfu.itis.paramonov.dto.response.DailyPuzzleResponseDto;
import ru.kpfu.itis.paramonov.service.ChessApiService;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/api/puzzle")
@AllArgsConstructor
public class ChessPuzzleController {

    private ChessApiService chessApiService;

    @GetMapping("/get/daily")
    public Mono<ResponseEntity<DailyPuzzleResponseDto>> getDailyPuzzle() {
        List<String> solution = new ArrayList<>();
        List<String> themes = new ArrayList<>();
        AtomicReference<Integer> rating = new AtomicReference<>();
        return chessApiService.getDailyPuzzle()
                .flatMap(response -> {
                    String pgn = response.getGame().getPgn();
                    solution.addAll(response.getPuzzle().getSolution());
                    themes.addAll(response.getPuzzle().getThemes());
                    rating.set(response.getPuzzle().getRating());

                    return chessApiService.convertPgnToFen(pgn);
                })
                .map(response -> ResponseEntity.ok(
                        new DailyPuzzleResponseDto(response.getFen(), rating.get(), solution, themes)
                ));
    }
}
