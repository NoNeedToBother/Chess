package ru.kpfu.itis.paramonov.converters.posts;

import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.converters.users.UserConverter;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.model.Comment;

@Component
@AllArgsConstructor
public class CommentConverter implements Converter<Comment, CommentDto> {

    private UserConverter userConverter;


    @Override
    public CommentDto convert(Comment source) {
        return CommentDto.builder()
                .id(source.getId())
                .content(source.getContent())
                .datePublished(source.getDatePublished())
                .commenter(userConverter.convert(source.getAuthor()))
                .build();
    }
}
