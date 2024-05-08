package ru.kpfu.itis.paramonov.converters.posts;

import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.converters.users.UserConverter;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.model.Comment;
import ru.kpfu.itis.paramonov.model.Post;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
                .comments(getCommentsSortedByDate(source.getComments()))
                .poster(userConverter.convert(source.getAuthor()))
                .build();
    }

    private List<CommentDto> getCommentsSortedByDate(Set<Comment> comments) {
        return comments.stream()
                .sorted((c1, c2) -> {
                    Timestamp datePosted1 = c1.getDatePublished();
                    Timestamp datePosted2 = c2.getDatePublished();
                    return (-1) * datePosted1.compareTo(datePosted2);
                })
                .map(comment -> commentConverter.convert(comment))
                .collect(Collectors.toList());
    }
}
