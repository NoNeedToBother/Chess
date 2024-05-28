package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PageAmountResponseDto extends BaseResponseDto{
    @JsonProperty("pageAmount")
    private Integer pageAmount;

    public PageAmountResponseDto(Integer pageAmount) {
        this.pageAmount = pageAmount;
    }

    public PageAmountResponseDto(String error) {
        super(error);
    }
}
