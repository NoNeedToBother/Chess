package ru.kpfu.itis.paramonov.converters.posts;

import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.converters.users.UserConverter;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.model.post.Post;

@Component
@AllArgsConstructor
public class PostConverter implements Converter<Post, PostDto> {

    private UserConverter userConverter;

    private CommentConverter commentConverter;

    @Override
    public PostDto convert(Post source) {
        return PostDto.builder()
                .id(source.getId())
                .datePosted(source.getDatePosted())
                .title(source.getTitle())
                .content(source.getContent())
                .description(source.getDescription())
                .imageUrl(source.getImageUrl())
                .authorId(source.getAuthor().getId())
                .build();
    }
}
