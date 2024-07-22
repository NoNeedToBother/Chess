package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PostsResponseDto extends BaseResponseDto{
    @JsonProperty("posts")
    private List<PostResponseDto> posts;

    public PostsResponseDto(List<PostResponseDto> posts) {
        this.posts = posts;
    }
}
