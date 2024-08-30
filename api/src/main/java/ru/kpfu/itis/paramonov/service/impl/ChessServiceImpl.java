package ru.kpfu.itis.paramonov.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.kpfu.itis.paramonov.dto.chess.ValidationRequestDto;
import ru.kpfu.itis.paramonov.dto.chess.ValidationResultDto;
import ru.kpfu.itis.paramonov.service.ChessService;
import ru.kpfu.itis.paramonov.utils.YamlPropertySourceFactory;

@Service
@RequiredArgsConstructor
@PropertySource(value = "classpath:apis.yaml", factory = YamlPropertySourceFactory.class)
public class ChessServiceImpl implements ChessService {

    private final WebClient webClient;

    @Value("${api.chess-validation.url}")
    private String chessValidationApiUrl;

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
}
