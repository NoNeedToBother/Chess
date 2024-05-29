package ru.kpfu.itis.paramonov.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UploadPostRequestDto {

    private String title;

    private String description;

    private String content;
}
