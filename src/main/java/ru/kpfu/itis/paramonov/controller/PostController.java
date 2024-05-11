package ru.kpfu.itis.paramonov.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.request.UploadPostRequestDto;
import ru.kpfu.itis.paramonov.dto.response.CommentsResponseDto;
import ru.kpfu.itis.paramonov.dto.response.PostResponseDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.service.PostService;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    private final UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<PostDto> upload(
            @RequestBody UploadPostRequestDto uploadPostRequestDto) {
        try {
            postService.save(uploadPostRequestDto);
            return null;
        } catch (InvalidParameterException e) {
            return null;
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private final static String GET_POST_FAIL_ERROR = "Could not get post";

    private final static String GET_COMMENTS_FAIL_ERROR = "Could not get comments";

    private final static String POST_NOT_EXIST_ERROR = "No post was found";

    @GetMapping("/get")
    public ResponseEntity<PostResponseDto> get(@RequestParam Long id) {
        try {
            Optional<PostDto> post = postService.getById(id);
            if (post.isPresent()) {
                UserDto author = userService.getById(post.get().getAuthorId()).get();
                PostResponseDto postResponseDto = new PostResponseDto(author, post.get());
                return ResponseEntity.ok(postResponseDto);
            } else {
                return new ResponseEntity<>(new PostResponseDto(POST_NOT_EXIST_ERROR), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new PostResponseDto(GET_POST_FAIL_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/comments")
    public ResponseEntity<CommentsResponseDto> getComments(@RequestParam Long id) {
        try {
            List<CommentDto> comments = postService.getComments(id);
            List<CommentsResponseDto.CommentResponseDto> commentResponseDtoList = comments.stream()
                    .map(comment -> {
                        UserDto author = userService.getById(comment.getAuthorId()).get();
                        return new CommentsResponseDto.CommentResponseDto(comment, author);
                    })
                    .collect(Collectors.toList());
            return new ResponseEntity<>(new CommentsResponseDto(commentResponseDtoList), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new CommentsResponseDto(GET_COMMENTS_FAIL_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
