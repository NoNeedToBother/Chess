package ru.kpfu.itis.paramonov.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum RoleDto {
    USER("USER"),
    MODERATOR("MODERATOR"),
    ADMIN("ADMIN"),
    CHIEF_ADMIN("CHIEF_ADMIN");

    private final String value;
}
