package ru.kpfu.itis.paramonov.dto.chess.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConversionResultDto {

    private String fen;

    private String error;
}
