package ru.kpfu.itis.paramonov.converters.posts;

import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.model.comment.Comment;

@Component
@AllArgsConstructor
public class CommentConverter implements Converter<Comment, CommentDto> {

    @Override
    public CommentDto convert(Comment source) {
        return CommentDto.builder()
                .id(source.getId())
                .content(source.getContent())
                .datePublished(source.getDatePublished().toString())
                .authorId(source.getAuthor().getId())
                .rating(source.getRating())
                .build();
    }
}
