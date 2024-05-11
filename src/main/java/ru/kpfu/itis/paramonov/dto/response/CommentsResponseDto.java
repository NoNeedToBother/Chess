package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;

import java.util.List;

public class CommentsResponseDto extends BaseResponseDto {

    @JsonProperty("comments")
    private List<CommentResponseDto> comments;

    public CommentsResponseDto(List<CommentResponseDto> comments) {
        this.comments = comments;
    }

    public CommentsResponseDto(String error) {
        this.error = error;
    }

    @AllArgsConstructor
    public static class CommentResponseDto {
        @JsonProperty("comment")
        private CommentDto comment;

        @JsonProperty("author")
        private UserDto user;
    }
}
