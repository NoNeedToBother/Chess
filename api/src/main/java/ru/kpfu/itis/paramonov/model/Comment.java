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

    private Integer rating = 0;
}
