package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.request.UploadCommentRequestDto;
import ru.kpfu.itis.paramonov.dto.response.BaseResponseDto;
import ru.kpfu.itis.paramonov.dto.response.CommentResponseDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.filter.jwt.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.CommentService;
import ru.kpfu.itis.paramonov.service.UserService;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.*;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
public class CommentController {

    private CommentService commentService;

    private UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<CommentResponseDto> upload(
            @RequestBody UploadCommentRequestDto uploadCommentRequestDto,
            JwtAuthentication authentication) {
        try {
            Long authorId = authentication.getId();
            CommentDto commentDto = commentService.save(uploadCommentRequestDto, authorId);
            UserDto userDto = userService.getById(authorId).get();
            return new ResponseEntity<>(new CommentResponseDto(commentDto, userDto), HttpStatus.CREATED);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(new CommentResponseDto(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new CommentResponseDto(UPLOAD_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/delete")
    public ResponseEntity<BaseResponseDto> delete(
            @RequestParam Long id, JwtAuthentication authentication) {
        try {
            Long from = authentication.getId();
            commentService.deleteById(id, from);
            return ResponseEntity.ok().build();
        } catch (NoSufficientAuthorityException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new BaseResponseDto(DELETE_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
