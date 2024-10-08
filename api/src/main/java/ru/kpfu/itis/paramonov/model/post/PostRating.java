package ru.kpfu.itis.paramonov.model.post;

import lombok.*;
import ru.kpfu.itis.paramonov.model.User;

import javax.persistence.*;

@Entity
@Table(name = "post_ratings")
@IdClass(PostRatingPK.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRating {

    @Id
    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private Post post;

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private Integer rating;
}
