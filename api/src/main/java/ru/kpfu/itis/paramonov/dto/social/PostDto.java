package ru.kpfu.itis.paramonov.dto.social;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class PostDto {

    private Long id;

    private Long authorId;

    private String imageUrl;

    private String title;

    private String content;

    private String description;

    private String datePosted;

    private Double rating;
}
