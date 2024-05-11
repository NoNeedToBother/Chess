package ru.kpfu.itis.paramonov.dto.request;

import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
public class UploadPostRequestDto {

    private MultipartFile image;

    private String title;

    private String description;

    private Long authorId;

    private String content;
}
