package ru.kpfu.itis.paramonov.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.request.UploadPostRequestDto;
import ru.kpfu.itis.paramonov.dto.response.BaseResponseDto;
import ru.kpfu.itis.paramonov.dto.response.CommentResponseDto;
import ru.kpfu.itis.paramonov.dto.response.CommentsResponseDto;
import ru.kpfu.itis.paramonov.dto.response.PostResponseDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.filter.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.PostService;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    private final UserService userService;

    private final static String UPLOAD_POST_FAIL = "Failed to upload post";

    private final static String DELETE_POST_FAIL = "Failed to delete comment";

    @PostMapping("/upload")
    public ResponseEntity<PostResponseDto> upload(
            @RequestBody UploadPostRequestDto uploadPostRequestDto,
            JwtAuthentication jwtAuthentication) {
        try {
            Long authorId = jwtAuthentication.getId();
            PostDto postDto = postService.save(uploadPostRequestDto, authorId);
            return get(postDto.getId());
        } catch (InvalidParameterException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new PostResponseDto(e.getMessage()));
        } catch (Exception e) {
            return new ResponseEntity<>(new PostResponseDto(UPLOAD_POST_FAIL), HttpStatus.INTERNAL_SERVER_ERROR);
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
            List<CommentResponseDto> commentResponseDtoList = comments.stream()
                    .map(comment -> {
                        UserDto author = userService.getById(comment.getAuthorId()).get();
                        return new CommentResponseDto(comment, author);
                    })
                    .collect(Collectors.toList());
            return new ResponseEntity<>(new CommentsResponseDto(commentResponseDtoList), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new CommentsResponseDto(GET_COMMENTS_FAIL_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/delete")
    public ResponseEntity<BaseResponseDto> delete(
            @RequestParam Long id, JwtAuthentication authentication) {
        try {
            Long from = authentication.getId();
            postService.deleteById(id, from);
            return ResponseEntity.ok().build();
        } catch (NoSufficientAuthorityException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (InvalidParameterException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new BaseResponseDto(DELETE_POST_FAIL), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
