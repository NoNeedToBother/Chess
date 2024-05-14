package ru.kpfu.itis.paramonov.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeniedRequestException extends RuntimeException{

    private String message;
}
