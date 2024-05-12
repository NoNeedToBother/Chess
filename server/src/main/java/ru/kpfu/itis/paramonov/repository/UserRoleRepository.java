package ru.kpfu.itis.paramonov.repository;

public interface UserRoleRepository {

    boolean isAdmin(Long id);

    boolean isModerator(Long id);
}
