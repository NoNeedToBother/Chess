package ru.kpfu.itis.paramonov.dto.users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class BanDto {

    private Long id;

    private Long bannedId;

    private Long givenFromId;

    private String givenFromUsername;

    private String givenAt;

    private String reason;
}
