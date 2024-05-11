package ru.kpfu.itis.paramonov.dto.social;


import lombok.*;

import java.sql.Timestamp;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class CommentDto {

    private Long id;

    private Long authorId;

    private Timestamp datePublished;

    private String content;

}