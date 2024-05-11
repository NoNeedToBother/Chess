package ru.kpfu.itis.paramonov.exceptions;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class InvalidParameterException extends RuntimeException {

    private String message;
}
