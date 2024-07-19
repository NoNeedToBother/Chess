package ru.kpfu.itis.paramonov.service;

import ru.kpfu.itis.paramonov.dto.request.UploadCommentRequestDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;

public interface CommentService {

    CommentDto save(Long postId, String content, Long authorId);

    void deleteById(Long commentId, Long fromId);

}
