package ru.kpfu.itis.paramonov.converters.users;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.dto.users.BanDto;
import ru.kpfu.itis.paramonov.model.Ban;

@Component
public class BanConverter implements Converter<Ban, BanDto> {
    @Override
    public BanDto convert(Ban source) {
        return BanDto.builder()
                .id(source.getId())
                .bannedId(source.getBannedUser().getId())
                .givenFromId(source.getGivenFrom().getId())
                .givenFromUsername(source.getGivenFrom().getUsername())
                .givenAt(source.getGivenAt().toString())
                .reason(source.getReason())
                .build();
    }
}
