package ru.kpfu.itis.paramonov.dto.social;


import lombok.*;
import ru.kpfu.itis.paramonov.dto.UserDto;

import java.sql.Timestamp;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class CommentDto {

    private Long id;

    private UserDto commenter;

    private Timestamp datePublished;

    private String content;

}