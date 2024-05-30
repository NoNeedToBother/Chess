package ru.kpfu.itis.paramonov.dto.users;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum RoleDto {
    USER("USER"),
    MODERATOR("MODERATOR"),
    ADMIN("ADMIN"),
    CHIEF_ADMIN("CHIEF_ADMIN");

    private final String value;
}
