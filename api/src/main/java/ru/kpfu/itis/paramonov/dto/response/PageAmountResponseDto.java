package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PageAmountResponseDto extends BaseResponseDto {
    @JsonProperty("pageAmount")
    private Integer pageAmount;

}
