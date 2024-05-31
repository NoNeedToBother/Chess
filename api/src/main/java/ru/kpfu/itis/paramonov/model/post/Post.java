package ru.kpfu.itis.paramonov.model.post;

import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import ru.kpfu.itis.paramonov.model.comment.Comment;
import ru.kpfu.itis.paramonov.model.User;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "posts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "poster_id")
    private User author;

    @Column(name = "post_img_url")
    private String imageUrl;

    @Column(unique = true)
    private String title;

    @Column(length = 5000)
    private String content;

    private String description;

    @Column(name = "date_posted")
    @CreationTimestamp
    private Timestamp datePosted;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.EAGER)
    @BatchSize(size = 100)
    private Set<Comment> comments;

    @PreRemove
    private void removePostFromAuthor() {

    }
}