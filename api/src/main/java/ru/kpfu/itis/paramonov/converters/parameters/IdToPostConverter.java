package ru.kpfu.itis.paramonov.converters.parameters;

import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.service.PostService;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.NO_POST_FOUND_ERROR;

@AllArgsConstructor
@Component
public class IdToPostConverter implements Converter<String, PostDto> {

    private PostService postService;

    @Override
    public PostDto convert(@NotNull String source) {
        return postService.getById(Long.parseLong(source))
                .orElseThrow(() -> new NotFoundException(NO_POST_FOUND_ERROR));
    }
}
