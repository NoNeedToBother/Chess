package ru.kpfu.itis.paramonov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserDto {

    private Long id;

    private String username;

    private String name;

    private String lastname;

    private String profilePicture;

    private String bio;

    private Timestamp dateRegistered;

    private boolean enabled;

    private boolean deactivated;

    private List<RoleDto> roles;
}
