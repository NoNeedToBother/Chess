package ru.kpfu.itis.paramonov.dto.request;

import lombok.Getter;

@Getter
public class PromoteUserRequestDto {

    private Long promotedId;

    private String role;
}
