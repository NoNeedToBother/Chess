package ru.kpfu.itis.paramonov.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class NoSufficientAuthorityException extends RuntimeException{

    private String message;
}
