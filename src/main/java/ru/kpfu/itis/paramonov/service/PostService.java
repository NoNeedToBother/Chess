package ru.kpfu.itis.paramonov.service;

import ru.kpfu.itis.paramonov.dto.request.UploadPostRequestDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;

import java.util.List;
import java.util.Optional;

public interface PostService {

    List<PostDto> getAll();

    Optional<PostDto> getById(long id);

    Optional<PostDto> getByTitle(String title);

    PostDto save(UploadPostRequestDto uploadPostRequestDto, Long authorId);

    boolean checkTitle(String title);

    List<CommentDto> getComments(long postId);

}
