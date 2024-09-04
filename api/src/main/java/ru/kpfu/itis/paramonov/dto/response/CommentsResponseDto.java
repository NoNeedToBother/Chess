package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class CommentsResponseDto extends BaseResponseDto {

    @JsonProperty("comments")
    private List<CommentResponseDto> comments;

}
