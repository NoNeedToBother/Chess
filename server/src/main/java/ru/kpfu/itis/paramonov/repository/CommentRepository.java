package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.paramonov.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
