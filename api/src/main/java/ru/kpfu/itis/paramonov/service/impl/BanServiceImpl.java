package ru.kpfu.itis.paramonov.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.converters.users.BanConverter;
import ru.kpfu.itis.paramonov.dto.users.BanDto;
import ru.kpfu.itis.paramonov.repository.BanRepository;
import ru.kpfu.itis.paramonov.service.BanService;

@Service
@AllArgsConstructor
public class BanServiceImpl implements BanService {

    private BanRepository banRepository;

    private BanConverter banConverter;

    @Override
    public BanDto getLatestBan(Long bannedId) {
        return banConverter.convert(banRepository.getLatestBan(bannedId));
    }
}
