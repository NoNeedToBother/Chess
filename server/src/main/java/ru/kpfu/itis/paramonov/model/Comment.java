package ru.kpfu.itis.paramonov.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "comments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "commenter_id")
    private User author;

    @Column(name = "date_published")
    @CreationTimestamp
    private Timestamp datePublished;

    private String content;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @PreRemove
    private void preRemove() {
        author.getComments().removeIf(comment -> comment.getId().equals(this.id));
    }
}
