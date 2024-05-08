package ru.kpfu.itis.paramonov.dto.social;

import lombok.*;
import ru.kpfu.itis.paramonov.dto.UserDto;

import java.sql.Timestamp;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class PostDto {

    private Long id;

    private UserDto poster;

    private String imageUrl;

    private String title;

    private String content;

    private String description;

    private Timestamp datePosted;

    private List<CommentDto> comments;
}
