package ru.kpfu.itis.paramonov.dto.chess.request;

import lombok.Getter;

@Getter
public class UpdateTimeRequestDto {

    private Integer from;

    private String gameId;

    private Integer time;
}
