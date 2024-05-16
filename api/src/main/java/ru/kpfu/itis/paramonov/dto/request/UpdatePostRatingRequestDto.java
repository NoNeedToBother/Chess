package ru.kpfu.itis.paramonov.dto.request;

import lombok.Getter;

@Getter
public class UpdatePostRatingRequestDto {

    private Long postId;

    private Integer rating;
}
