package ru.kpfu.itis.paramonov.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.paramonov.dto.response.BaseResponseDto;
import ru.kpfu.itis.paramonov.exceptions.*;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.INTERNAL_SERVER_ERROR;

@ControllerAdvice
@RestController
public class ExceptionHandlerController {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public BaseResponseDto onDefaultException(Exception e) {
        return new BaseResponseDto(INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public BaseResponseDto onNotFound(Exception e) {
        return new BaseResponseDto(e.getMessage());
    }

    @ExceptionHandler({InvalidParameterException.class, InvalidCredentialsException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BaseResponseDto onInvalidParameter(Exception e) {
        return new BaseResponseDto(e.getMessage());
    }

    @ExceptionHandler(NoSufficientAuthorityException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public BaseResponseDto onNoSufficientAuthority(Exception e) {
        return new BaseResponseDto(e.getMessage());
    }

    @ExceptionHandler(DeniedRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BaseResponseDto onDeniedRequest(Exception e) {
        return new BaseResponseDto(e.getMessage());
    }
}
