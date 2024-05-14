package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.repository.Repository;
import ru.kpfu.itis.paramonov.model.User;

public interface UserRoleRepository extends Repository<User, Long> {

    boolean hasAdminAuthority(Long id);

    boolean hasModeratorAuthority(Long id);
}
