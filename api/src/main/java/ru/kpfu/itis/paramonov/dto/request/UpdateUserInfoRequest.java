package ru.kpfu.itis.paramonov.dto.request;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class UpdateUserInfoRequest {

    private String name;

    private String lastname;

    private String bio;
}
