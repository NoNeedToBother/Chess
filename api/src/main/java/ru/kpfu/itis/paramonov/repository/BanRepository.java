package ru.kpfu.itis.paramonov.repository;

import org.springframework.data.repository.query.Param;
import ru.kpfu.itis.paramonov.model.Ban;

public interface BanRepository {

    Ban getLatestBan(@Param("id") Long userId);
}
