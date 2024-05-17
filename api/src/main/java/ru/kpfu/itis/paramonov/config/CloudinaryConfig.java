package ru.kpfu.itis.paramonov.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import ru.kpfu.itis.paramonov.properties.YamlPropertySourceFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
@PropertySource(value = "classpath:cloudinary.yaml", factory = YamlPropertySourceFactory.class)
public class CloudinaryConfig {

    private final String cloudName;

    private final String apiKey;

    private final String apiSecret;

    public CloudinaryConfig(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> configMap = new HashMap<>();
        configMap.put("cloud_name", cloudName);
        configMap.put("api_key", apiKey);
        configMap.put("api_secret", apiSecret);
        return new Cloudinary(configMap);
    }
}
