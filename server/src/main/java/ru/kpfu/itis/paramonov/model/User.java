package ru.kpfu.itis.paramonov.model;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;

import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @ColumnDefault("\'Not specified\'")
    private String name;

    @ColumnDefault("\'Not specified\'")
    private String lastname;

    @Column(name = "profile_picture")
    private String profilePicture;

    @ColumnDefault("\'Not specified\'")
    private String bio;

    @Column(name = "date_registered")
    @CreationTimestamp
    private Timestamp dateRegistered;


    @Column(length = 64, nullable = false)
    private String password;

    @ColumnDefault("false")
    private boolean enabled;

    @ColumnDefault("false")
    private boolean deactivated;

    @ElementCollection(targetClass = Role.class)
    @CollectionTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Role> roles;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.EAGER)
    @BatchSize(size = 50)
    private Set<Post> posts;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.EAGER)
    //@BatchSize(size = 0)
    private Set<Comment> comments;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_likes",
            joinColumns = @JoinColumn(name = "receiver_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "sender_id", referencedColumnName = "id")
    )
    private Set<User> likesReceivedFrom;

    @ManyToMany(mappedBy = "likesReceivedFrom",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER)
    private Set<User> likesSentTo;

    @OneToMany(mappedBy = "bannedUser", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Ban> receivedBans;

    @OneToMany(mappedBy = "givenFrom", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Ban> givenBans;

}