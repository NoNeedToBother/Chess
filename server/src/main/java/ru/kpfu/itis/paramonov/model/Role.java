package ru.kpfu.itis.paramonov.model;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@RequiredArgsConstructor
public enum Role implements GrantedAuthority {

    USER("USER"),
    MODERATOR("MODERATOR"),
    ADMIN("ADMIN"),
    CHIEF_ADMIN("CHIEF_ADMIN");

    private final String value;

    @Override
    public String getAuthority() {
        return value;
    }
}