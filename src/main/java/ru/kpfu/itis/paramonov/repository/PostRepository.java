package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.paramonov.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    Post findByTitle(String title);

    boolean existsByTitle(String title);
}
