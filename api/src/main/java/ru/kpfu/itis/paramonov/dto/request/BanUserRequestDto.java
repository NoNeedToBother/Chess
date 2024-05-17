package ru.kpfu.itis.paramonov.dto.request;

import lombok.Getter;

@Getter
public class BanUserRequestDto {

    private Long bannedId;

    private String reason;
}
