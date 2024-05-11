package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;

public class PostResponseDto extends BaseResponseDto {

    @JsonProperty("author")
    private UserDto user;

    @JsonProperty("post")
    private PostDto post;

    public PostResponseDto(UserDto user, PostDto post) {
        this.user = user;
        this.post = post;
    }

    public PostResponseDto(String error) {
        super(error);
    }
}
