package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.kpfu.itis.paramonov.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("select count(c) > 0 from Comment c where c.id = :commentId and c.author.id = :userId")
    boolean doesBelongToUser(Long userId, Long commentId);
}
