package ru.kpfu.itis.paramonov.repository;

public interface UserRoleRepository {

    boolean hasAdminAuthority(Long id);

    boolean hasModeratorAuthority(Long id);
}
