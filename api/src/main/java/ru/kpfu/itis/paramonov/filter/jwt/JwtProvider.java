package ru.kpfu.itis.paramonov.filter.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.utils.YamlPropertySourceFactory;

import javax.crypto.SecretKey;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
@PropertySource(value = "classpath:jwt.yaml", factory = YamlPropertySourceFactory.class)
public class JwtProvider {

    private final SecretKey jwtAccessSecret;
    private final SecretKey jwtRefreshSecret;

    private static final int JWT_TOKEN_EXPIRATION_TIME_MINUTES = 20;

    private static final int JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAYS = 14;


    public JwtProvider(
            @Value("${jwt.secret.access}") String jwtAccessSecret,
            @Value("${jwt.secret.refresh}") String jwtRefreshSecret
    ) {
        this.jwtAccessSecret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtAccessSecret));
        this.jwtRefreshSecret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtRefreshSecret));
    }

    public String generateAccessToken(User user) {
        LocalDateTime now = LocalDateTime.now();
        Instant accessExpirationTime = now.plusSeconds(30L)
                .atZone(ZoneId.systemDefault()).toInstant();
        Date accessExpiration = Date.from(accessExpirationTime);
        return Jwts.builder()
                .id(user.getId().toString())
                .subject(user.getUsername())
                .expiration(accessExpiration)
                .signWith(jwtAccessSecret)
                .claim("roles", user.getRoles())
                .claim("id", user.getId())
                .compact();
    }

    public String generateRefreshToken(User user) {
        LocalDateTime now = LocalDateTime.now();
        Instant accessExpirationTime = now.plusDays(JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAYS)
                .atZone(ZoneId.systemDefault()).toInstant();
        Date accessExpiration = Date.from(accessExpirationTime);
        return Jwts.builder()
                .id(user.getId().toString())
                .subject(user.getUsername())
                .expiration(accessExpiration)
                .signWith(jwtRefreshSecret)
                .claim("roles", user.getRoles())
                .claim("id", user.getId())
                .compact();
    }

    public boolean validateAccessToken(String token) {
        return validateToken(token, jwtAccessSecret);
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, jwtRefreshSecret);
    }

    public Claims getAcessClaims(String token) {
        return getClaims(token, jwtAccessSecret);
    }

    public Claims getRefreshClaims(String token) {
        return getClaims(token, jwtRefreshSecret);
    }

    private Claims getClaims(String token, SecretKey secret) {
        return Jwts.parser()
                .verifyWith(secret)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean validateToken(String token, SecretKey secret) {
        try {
            Jwts.parser()
                    .verifyWith(secret)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
        } catch (UnsupportedJwtException e) {
        } catch (MalformedJwtException e) {
        } catch (SignatureException e) {
        } catch (Exception e) {
        }
        return false;
    }
}