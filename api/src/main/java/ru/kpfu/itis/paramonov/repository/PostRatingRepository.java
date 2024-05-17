package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.kpfu.itis.paramonov.model.post.Post;
import ru.kpfu.itis.paramonov.model.post.PostRating;
import ru.kpfu.itis.paramonov.model.User;

public interface PostRatingRepository extends JpaRepository<PostRating, Long> {

    boolean existsByPostAndUser(Post post, User user);

    @Query(value = "insert into post_ratings(post_id, user_id, rating) values (:postId, :userId, :rating)", nativeQuery = true)
    @Modifying
    void addRating(@Param("postId") Long postId, @Param("userId") Long userId, @Param("rating") Integer rating);

    @Query("update PostRating pr set pr.rating = :rating where pr.user.id = :userId and pr.post.id = :postId")
    @Modifying
    void updateRating(@Param("postId") Long postId, @Param("userId") Long userId, @Param("rating") Integer rating);

    @Query("select avg(r.rating) from PostRating r where r.post.id = :id")
    Double getAverageRating(@Param("id") Long postId);
}
