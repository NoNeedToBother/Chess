package ru.kpfu.itis.paramonov.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ru.kpfu.itis.paramonov.converters.parameters.IdToPostConverter;
import ru.kpfu.itis.paramonov.converters.parameters.IdToUserConverter;

@Configuration
@AllArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private IdToUserConverter idToUserConverter;

    private IdToPostConverter idToPostConverter;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(idToPostConverter);
        registry.addConverter(idToUserConverter);
    }
}
