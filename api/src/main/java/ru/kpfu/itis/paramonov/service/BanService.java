package ru.kpfu.itis.paramonov.service;

import ru.kpfu.itis.paramonov.dto.users.BanDto;

public interface BanService {

    BanDto getLatestBan(Long bannedId);

}
