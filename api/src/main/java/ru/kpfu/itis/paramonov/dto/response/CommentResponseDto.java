package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;

@AllArgsConstructor
public class CommentResponseDto extends BaseResponseDto {
    @JsonProperty("comment")
    private CommentDto comment;

    @JsonProperty("author")
    private UserDto user;
}
