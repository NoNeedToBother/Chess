package ru.kpfu.itis.paramonov.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserBannedException extends RuntimeException {

    private String message;

}
