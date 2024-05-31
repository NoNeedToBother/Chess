package ru.kpfu.itis.paramonov.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.dto.request.UpdatePostRatingRequestDto;
import ru.kpfu.itis.paramonov.dto.request.UploadPostRequestDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;

import java.util.List;
import java.util.Optional;

public interface PostService {

    Page<PostDto> getAll(Pageable pageable);

    Optional<PostDto> getById(long id);

    Optional<PostDto> getByTitle(String title);

    PostDto save(UploadPostRequestDto uploadPostRequestDto, MultipartFile image, Long authorId);

    boolean checkTitle(String title);

    List<CommentDto> getComments(long postId);

    void deleteById(Long postId, Long fromId);

    PostDto updateRating(UpdatePostRatingRequestDto updatePostRatingRequestDto, Long fromId);

    Double getAverageRating(Long postId);

    Integer getTotalPageAmount(int pageSize);

}
