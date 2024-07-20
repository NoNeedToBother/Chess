package ru.kpfu.itis.paramonov.dto.chess.request;

import lombok.Getter;

@Getter
public class ConcedeRequestDto {

    private Integer from;

    private String gameId;

    private String reason;
}
