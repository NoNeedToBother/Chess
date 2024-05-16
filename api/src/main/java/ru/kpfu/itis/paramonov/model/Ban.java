package ru.kpfu.itis.paramonov.model;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "bans")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Ban {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "banned_id")
    private User bannedUser;

    @ManyToOne
    @JoinColumn(name = "from_id")
    private User givenFrom;

    @Column(name = "date_banned")
    @CreationTimestamp
    private Timestamp givenAt;

    @ColumnDefault("\'No reason was provided\'")
    private String reason;

    @ColumnDefault("false")
    private boolean unbanned;
}
