package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.kpfu.itis.paramonov.model.post.Post;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Post findByTitle(String title);

    boolean existsByTitle(String title);

    @Query("select count(p) <> 0 from Post p where p.id = :postId and p.author.id = :userId")
    boolean doesBelongToUser(@Param("userId") Long userId, @Param("postId") Long postId);

    @Query("select count(p) from Post p")
    Integer getTotalAmount();

    @Query(value = "select * from posts as p where p.poster_id = :userId order by p.date_posted desc limit :limit", nativeQuery = true)
    List<Post> findAllByUserId(@Param("userId") Long userId, @Param("limit") Integer limit);

}
