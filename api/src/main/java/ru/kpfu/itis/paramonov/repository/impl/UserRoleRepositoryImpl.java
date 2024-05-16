package ru.kpfu.itis.paramonov.repository.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.repository.UserRoleRepository;
import ru.kpfu.itis.paramonov.model.Role;
import ru.kpfu.itis.paramonov.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Repository
@AllArgsConstructor
public class UserRoleRepositoryImpl implements UserRoleRepository {

    private UserRepository userRepository;

    @Override
    public boolean hasAdminAuthority(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return false;
        Set<Role> roles = user.getRoles();
        List<Role> adminRoles = getAdminRoles();
        return adminRoles.stream()
                .anyMatch(roles::contains);
    }

    @Override
    public boolean hasModeratorAuthority(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return false;
        Set<Role> roles = user.getRoles();
        List<Role> moderatorRoles = getModeratorRoles();
        return moderatorRoles.stream()
                .anyMatch(roles::contains);
    }

    private List<Role> getAdminRoles() {
        List<Role> adminRoles = new ArrayList<>();
        adminRoles.add(Role.ADMIN);
        adminRoles.add(Role.CHIEF_ADMIN);
        return adminRoles;
    }

    private List<Role> getModeratorRoles() {
        List<Role> moderatorRoles = getAdminRoles();
        moderatorRoles.add(Role.MODERATOR);
        return moderatorRoles;
    }
}
