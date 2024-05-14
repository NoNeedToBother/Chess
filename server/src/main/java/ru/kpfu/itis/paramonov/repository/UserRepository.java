package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.kpfu.itis.paramonov.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Query("select count(b) <> 0 from Ban b where b.bannedUser = :id and b.unbanned = false")
    boolean isBanned(@Param("id") Long userId);

    @Query(value = "insert into bans(banned_id, from_id, reason) values (:banned, :from, :reason)",
            nativeQuery = true)
    void ban(@Param("banned") Long bannedId, @Param("from") Long fromId, @Param("reason") String reason);

    @Query(value = "update Ban b set b.unbanned = true where b.bannedUser.id = :banned and b.givenFrom.id = :from")
    @Modifying
    void unban(@Param("banned") Long bannedId, @Param("from") Long fromId);

    @Query(value = "select count(r) <> 0 from user_role as r where r.user_id = :id and r.role = 'ADMIN'", nativeQuery = true)
    boolean isAdmin(@Param("id") Long userId);

    @Query(value = "select count(r) <> 0 from user_role as r where r.user_id = :id and r.role = 'MODERATOR'", nativeQuery = true)
    boolean isModerator(@Param("id") Long userId);

    @Query(value = "select count(r) <> 0 from user_role as r where r.user_id = :id and r.role = 'CHIEF_ADMIN'", nativeQuery = true)
    boolean isChiefAdmin(@Param("id") Long userId);

}
