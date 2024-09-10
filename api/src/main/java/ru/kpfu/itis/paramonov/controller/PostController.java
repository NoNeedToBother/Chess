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
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.filter.jwt.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.PostService;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.List;
import java.util.Objects;
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
        Long authorId = jwtAuthentication.getId();
        UploadPostRequestDto uploadPostRequestDto = new UploadPostRequestDto(title, description, content);
        PostDto postDto = postService.save(
                uploadPostRequestDto.getTitle(),
                uploadPostRequestDto.getDescription(),
                uploadPostRequestDto.getContent(),
                image, authorId);
        return get(postDto);
    }

    @GetMapping("/get")
    public ResponseEntity<PostResponseDto> get(@RequestParam("id") PostDto post) {
        UserDto author = userService.getById(post.getAuthorId()).orElseThrow(
                () -> new NotFoundException(NO_USER_FOUND_ERROR)
        );
        PostResponseDto postResponseDto = new PostResponseDto(author, post);
        return ResponseEntity.ok(postResponseDto);
    }

    @GetMapping("/get/all")
    public ResponseEntity<Page<PostResponseDto>> getAll(Pageable pageable) {
        Page<PostResponseDto> resp = postService.getAll(pageable).map(post -> {
            UserDto author = userService.getById(post.getAuthorId()).orElseThrow(
                    () -> new NotFoundException(NO_USER_FOUND_ERROR)
            );
            return new PostResponseDto(author, post);
        });
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @GetMapping("/get/comments")
    public ResponseEntity<CommentsResponseDto> getComments(@RequestParam Long id) {
        List<CommentDto> comments = postService.getComments(id);
        List<CommentResponseDto> commentResponseDtoList = comments.stream()
                .map(comment -> {
                    Optional<UserDto> author = userService.getById(comment.getAuthorId());
                    return author.map(userDto -> new CommentResponseDto(comment, userDto)).orElse(null);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return new ResponseEntity<>(new CommentsResponseDto(commentResponseDtoList), HttpStatus.OK);
    }
    @PostMapping("/delete")
    public ResponseEntity<BaseResponseDto> delete(
            @RequestParam Long id, JwtAuthentication authentication) {
        Long from = authentication.getId();
        postService.deleteById(id, from);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update/rating")
    public ResponseEntity<PostResponseDto> updateRating(
            @RequestBody UpdatePostRatingRequestDto updatePostRatingRequestDto, JwtAuthentication authentication
    ) {
        Long from = authentication.getId();
        PostDto result = postService.updateRating(updatePostRatingRequestDto.getPostId(),
                updatePostRatingRequestDto.getRating(), from);
        UserDto author = userService.getById(result.getAuthorId()).orElseThrow(
                () -> new NotFoundException(NO_USER_FOUND_ERROR)
        );
        return new ResponseEntity<>(new PostResponseDto(author, result), HttpStatus.OK);
    }

    @GetMapping("/get/pageamount")
    public ResponseEntity<PageAmountResponseDto> getPageAmount(@RequestParam Integer size) {
        Integer amount = postService.getTotalPageAmount(size);
        return new ResponseEntity<>(new PageAmountResponseDto(amount), HttpStatus.OK);
    }
}
