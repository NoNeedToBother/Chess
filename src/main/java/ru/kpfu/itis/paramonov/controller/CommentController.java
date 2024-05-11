package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.request.UploadCommentRequestDto;
import ru.kpfu.itis.paramonov.dto.response.CommentResponseDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.filter.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.CommentService;
import ru.kpfu.itis.paramonov.service.UserService;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
@Slf4j
public class CommentController {

    private CommentService commentService;

    private UserService userService;

    private final static String UPLOAD_COMMENT_FAIL = "Failed to upload comment";

    @PostMapping("/upload")
    public ResponseEntity<CommentResponseDto> upload(
            @RequestBody UploadCommentRequestDto uploadCommentRequestDto,
            JwtAuthentication authentication) {
        try {
            Long authorId = authentication.getId();
            CommentDto commentDto = commentService.save(uploadCommentRequestDto, authorId);
            UserDto userDto = userService.getById(authorId).get();
            return new ResponseEntity<>(new CommentResponseDto(commentDto, userDto), HttpStatus.CREATED);
        } catch (InvalidParameterException e) {
            return new ResponseEntity<>(new CommentResponseDto(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new CommentResponseDto(UPLOAD_COMMENT_FAIL), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
