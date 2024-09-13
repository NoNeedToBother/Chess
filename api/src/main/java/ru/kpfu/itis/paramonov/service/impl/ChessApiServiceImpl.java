package ru.kpfu.itis.paramonov.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.kpfu.itis.paramonov.dto.chess.api.ConversionRequestDto;
import ru.kpfu.itis.paramonov.dto.chess.api.ConversionResultDto;
import ru.kpfu.itis.paramonov.dto.chess.api.ValidationRequestDto;
import ru.kpfu.itis.paramonov.dto.chess.api.ValidationResultDto;
import ru.kpfu.itis.paramonov.dto.chess.api.lichess.DailyPuzzleInfoResultDto;
import ru.kpfu.itis.paramonov.service.ChessApiService;
import ru.kpfu.itis.paramonov.utils.YamlPropertySourceFactory;

@Service
@RequiredArgsConstructor
@PropertySource(value = "classpath:apis.yaml", factory = YamlPropertySourceFactory.class)
public class ChessApiServiceImpl implements ChessApiService {

    private final WebClient webClient;

    @Value("${api.chess.validation.url}")
    private String chessValidationApiUrl;

    @Value("${api.chess.conversion.url}")
    private String chessConversionApiUrl;

    @Value("${api.lichess.daily-puzzle.url}")
    private String lichessDailyPuzzleApiUrl;

    @Override
    public Mono<ValidationResultDto> validateMove(String from, String to, String color, String turn, String fen, String promotion) {
        ValidationRequestDto validationRequestDto = new ValidationRequestDto(
                from, to, color, turn, fen, promotion
        );

        return webClient.post()
                .uri(chessValidationApiUrl)
                .bodyValue(validationRequestDto)
                .retrieve()
                .bodyToMono(ValidationResultDto.class);
    }

    @Override
    public Mono<ConversionResultDto> convertPgnToFen(String pgn) {
        ConversionRequestDto conversionRequestDto = new ConversionRequestDto(pgn);

        return webClient.post()
                .uri(chessConversionApiUrl)
                .bodyValue(conversionRequestDto)
                .retrieve()
                .bodyToMono(ConversionResultDto.class);
    }

    @Override
    public Mono<DailyPuzzleInfoResultDto> getDailyPuzzle() {
        return webClient.get()
                .uri(lichessDailyPuzzleApiUrl)
                .retrieve()
                .bodyToMono(DailyPuzzleInfoResultDto.class);
    }
}
