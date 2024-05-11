package ru.kpfu.itis.paramonov.service;

import ru.kpfu.itis.paramonov.dto.social.CommentDto;

public interface CommentService {

    CommentDto save(long postId, long commenterId, String content);

}
