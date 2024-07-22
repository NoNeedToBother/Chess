package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class CommentsResponseDto extends BaseResponseDto {

    @JsonProperty("comments")
    private List<CommentResponseDto> comments;

    public CommentsResponseDto(List<CommentResponseDto> comments) {
        this.comments = comments;
    }
}
