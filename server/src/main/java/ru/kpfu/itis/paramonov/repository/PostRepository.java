package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.kpfu.itis.paramonov.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    Post findByTitle(String title);

    boolean existsByTitle(String title);

    @Query("select count(p) <> 0 from Post p where p.id = :postId and p.author.id = :userId")
    boolean doesBelongToUser(Long userId, Long postId);

    @Query("update Post p set p.author = null where p.id = :postId")
    @Modifying
    void removeAuthor(Long postId);
}
