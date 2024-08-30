package ru.kpfu.itis.paramonov.filter.jwt;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;
import ru.kpfu.itis.paramonov.model.Role;
import ru.kpfu.itis.paramonov.service.UserService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.USER_BANNED_ERROR;

@Component
@RequiredArgsConstructor
public class JwtFilter extends GenericFilterBean {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER = "Bearer";

    private final JwtProvider jwtProvider;

    private final UserService userService;

    public static JwtAuthentication generate(Claims claims) {
        JwtAuthentication jwtAuthentication = new JwtAuthentication();
        jwtAuthentication.setRoles(getRoles(claims));
        jwtAuthentication.setUsername(claims.getSubject());
        jwtAuthentication.setId(claims.get("id", Long.class));
        return jwtAuthentication;
    }

    private static Set<Role> getRoles(Claims claims) {
        List<String> roles = claims.get("roles", List.class);
        return roles
                .stream()
                .map(Role::valueOf)
                .collect(Collectors.toSet());
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        String token = getTokenFromRequest((HttpServletRequest) servletRequest);
        if (token != null) {
            if (jwtProvider.validateAccessToken(token)) {
                Claims claims = jwtProvider.getAcessClaims(token);
                Long id = claims.get("id", Long.class);
                if (id != null) {
                    if (userService.isBanned(id)) {
                        SecurityContextHolder.clearContext();
                        HttpServletResponse response = (HttpServletResponse) servletResponse;
                        servletResponse.getWriter().print("{\"error\":\"" + USER_BANNED_ERROR + "\"}");
                        servletResponse.getWriter().flush();
                        servletResponse.getWriter().close();
                        response.sendError(HttpServletResponse.SC_FORBIDDEN);
                        filterChain.doFilter(servletRequest, servletResponse);
                        return;
                    }
                }
                JwtAuthentication jwtAuthentication = generate(claims);
                jwtAuthentication.setAuthenticated(true);
                SecurityContextHolder.getContext().setAuthentication(jwtAuthentication);
            }
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader(AUTHORIZATION_HEADER);
        if (bearer != null && bearer.startsWith(BEARER)) {
            return bearer.substring(BEARER.length()).trim();
        }
        return null;
    }
}
