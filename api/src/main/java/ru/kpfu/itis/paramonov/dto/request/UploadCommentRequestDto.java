package ru.kpfu.itis.paramonov.dto.request;

import lombok.Getter;

@Getter
public class UploadCommentRequestDto {

    private Long postId;

    private String content;
}
