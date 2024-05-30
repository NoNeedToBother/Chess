package ru.kpfu.itis.paramonov.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.request.UpdatePostRatingRequestDto;
import ru.kpfu.itis.paramonov.dto.request.UploadPostRequestDto;
import ru.kpfu.itis.paramonov.dto.response.*;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.DeniedRequestException;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.filter.jwt.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.PostService;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    private final UserService userService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> upload(
            @RequestPart("image") MultipartFile image,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("description") String description,
            JwtAuthentication jwtAuthentication) {
        try {
            Long authorId = jwtAuthentication.getId();
            UploadPostRequestDto uploadPostRequestDto = new UploadPostRequestDto(title, description, content);
            PostDto postDto = postService.save(uploadPostRequestDto, image, authorId);
            return get(postDto.getId());
        } catch (InvalidParameterException e) {
            return new ResponseEntity<>(new PostResponseDto(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new PostResponseDto(UPLOAD_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<PostResponseDto> get(@RequestParam Long id) {
        try {
            Optional<PostDto> post = postService.getById(id);
            if (post.isPresent()) {
                UserDto author = userService.getById(post.get().getAuthorId()).get();
                PostResponseDto postResponseDto = new PostResponseDto(author, post.get());
                return ResponseEntity.ok(postResponseDto);
            } else {
                return new ResponseEntity<>(new PostResponseDto(NO_POST_FOUND_ERROR), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new PostResponseDto(GET_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/all")
    public ResponseEntity<Page<PostResponseDto>> getAll(Pageable pageable) {
        try {
            Page<PostResponseDto> resp = postService.getAll(pageable).map(post -> {
                UserDto author = userService.getById(post.getAuthorId()).get();
                PostResponseDto postResponseDto = new PostResponseDto(author, post);
                return postResponseDto;
            });
            return new ResponseEntity<>(resp, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
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
            return new ResponseEntity<>(new CommentsResponseDto(GET_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/delete")
    public ResponseEntity<BaseResponseDto> delete(
            @RequestParam Long id, JwtAuthentication authentication) {
        try {
            Long from = authentication.getId();
            postService.deleteById(id, from);
            return ResponseEntity.ok().build();
        } catch (NoSufficientAuthorityException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new BaseResponseDto(DELETE_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update/rating")
    public ResponseEntity<PostResponseDto> updateRating(
            @RequestBody UpdatePostRatingRequestDto updatePostRatingRequestDto, JwtAuthentication authentication
    ) {
        try {
            Long from = authentication.getId();
            PostDto result = postService.updateRating(updatePostRatingRequestDto, from);
            UserDto author = userService.getById(result.getAuthorId()).get();
            return new ResponseEntity<>(new PostResponseDto(author, result), HttpStatus.OK);
        } catch (DeniedRequestException e) {
            return new ResponseEntity<>(new PostResponseDto(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(new PostResponseDto(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new PostResponseDto(UPDATE_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/pageamount")
    public ResponseEntity<PageAmountResponseDto> getPageAmount(@RequestParam Integer size) {
        try {
            Integer amount = postService.getTotalPageAmount(size);
            return new ResponseEntity<>(new PageAmountResponseDto(amount), HttpStatus.OK);
        } catch (InvalidParameterException e) {
            return new ResponseEntity<>(new PageAmountResponseDto(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new PageAmountResponseDto(GET_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
