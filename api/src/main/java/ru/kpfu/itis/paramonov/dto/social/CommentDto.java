package ru.kpfu.itis.paramonov.dto.social;


import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class CommentDto {

    private Long id;

    private Long authorId;

    private String datePublished;

    private String content;

    private Integer rating;

}