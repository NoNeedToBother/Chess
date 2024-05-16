package ru.kpfu.itis.paramonov.service.impl;

import com.cloudinary.Cloudinary;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.dto.request.UpdatePostRatingRequestDto;
import ru.kpfu.itis.paramonov.exceptions.DeniedRequestException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.repository.PostRatingRepository;
import ru.kpfu.itis.paramonov.service.PostService;
import ru.kpfu.itis.paramonov.converters.posts.CommentConverter;
import ru.kpfu.itis.paramonov.converters.posts.PostConverter;
import ru.kpfu.itis.paramonov.dto.request.UploadPostRequestDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.model.Post;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.PostRepository;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.repository.UserRoleRepository;

import javax.transaction.Transactional;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.security.InvalidParameterException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.*;

@Service
@AllArgsConstructor
public class PostServiceImpl implements PostService {

    private PostRepository postRepository;

    private UserRepository userRepository;

    private UserRoleRepository userRoleRepository;

    private PostConverter postConverter;

    private CommentConverter commentConverter;

    private PostRatingRepository postRatingRepository;

    private Cloudinary cloudinary;

    @Override
    public List<PostDto> getAll() {
        return postRepository
                .findAll()
                .stream().map( post -> {
                    PostDto dto = postConverter.convert(post);
                    dto.setRating(postRatingRepository.getAverageRating(post.getId()));
                    return dto;
                }
                )
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PostDto> getById(long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return Optional.empty();
        } else {
            PostDto dto = postConverter.convert(post);
            dto.setRating(postRatingRepository.getAverageRating(post.getId()));
            return Optional.ofNullable(dto);
        }
    }

    @Override
    public Optional<PostDto> getByTitle(String title) {
        Post post = postRepository.findByTitle(title);
        return Optional.ofNullable(postConverter.convert(post));
    }

    @Override
    public PostDto save(UploadPostRequestDto uploadPostRequestDto, Long authorId) {
        User poster = userRepository.findById(authorId).orElseThrow(RuntimeException::new);
        if (!checkTitle(uploadPostRequestDto.getTitle()))
            throw new InvalidParameterException(POST_EXISTS_ERROR);
        try {
            String imageUrl = uploadPostImage(uploadPostRequestDto.getImage());
            Post post = Post.builder()
                    .author(poster)
                    .imageUrl(imageUrl)
                    .content(uploadPostRequestDto.getContent())
                    .description(uploadPostRequestDto.getDescription())
                    .title(uploadPostRequestDto.getTitle())
                    .build();
            Post savedPost = postRepository.save(post);
            return postConverter.convert(savedPost);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static final String FILE_PATH_PREFIX = "/tmp";
    public static final int DIRECTORIES_COUNT = 100;

    private String uploadPostImage(MultipartFile image) throws IOException {
        String filename = Paths.get(image.getOriginalFilename()).getFileName().toString();

        File file = new File(FILE_PATH_PREFIX + File.separator + filename.hashCode() % DIRECTORIES_COUNT +
                File.separator + filename);

        InputStream content = image.getInputStream();
        file.getParentFile().mkdirs();
        file.createNewFile();

        FileOutputStream out = new FileOutputStream(file);
        byte[] buffer = new byte[content.available()];
        content.read(buffer);
        out.write(buffer);
        out.close();

        return cloudinary.uploader().upload(file, new HashMap<>()).get("secure_url").toString();
    }

    @Override
    public boolean checkTitle(String title) {
        return !postRepository.existsByTitle(title);
    }

    @Override
    public List<CommentDto> getComments(long postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) throw new RuntimeException();
        return post.getComments().stream()
                .sorted((c1, c2) -> {
                    Timestamp datePosted1 = c1.getDatePublished();
                    Timestamp datePosted2 = c2.getDatePublished();
                    return (-1) * datePosted1.compareTo(datePosted2);
                })
                .map(comment -> commentConverter.convert(comment))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long postId, Long fromId) {
        Optional<Post> post = postRepository.findById(postId);
        if (!post.isPresent()) throw new NotFoundException(NO_POST_FOUND_ERROR);
        if (userRoleRepository.hasModeratorAuthority(fromId)) {
            deletePost(fromId, post.get());
        }
        else if (postRepository.doesBelongToUser(fromId, postId)) {
            deletePost(fromId, post.get());
        } else throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
    }

    @Override
    @Transactional
    public void updateRating(UpdatePostRatingRequestDto updatePostRatingRequestDto, Long fromId) {
        Optional<Post> post = postRepository.findById(updatePostRatingRequestDto.getPostId());
        User user = userRepository.findById(fromId).get();
        Integer rating = updatePostRatingRequestDto.getRating();
        if (post.isPresent()) {
            if (post.get().getAuthor().getId().equals(fromId)) {
                throw new DeniedRequestException(UPDATE_OWN_POST_DENIED_ERROR);
            }
            if (postRatingRepository.existsByPostAndUser(post.get(), user)) {
                postRatingRepository.updateRating(post.get().getId(), user.getId(), rating);
            } else {
                postRatingRepository.addRating(post.get().getId(), user.getId(), rating);
            }
        } else throw new NotFoundException(NO_POST_FOUND_ERROR);
    }

    @Override
    public Double getAverageRating(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        if (post.isPresent()) {
            return postRatingRepository.getAverageRating(postId);
        } else throw new NotFoundException(NO_POST_FOUND_ERROR);
    }

    private void deletePost(Long authorId, Post post) {
        User author = userRepository.findById(authorId).get();
        author.getPosts().removeIf(p -> p.getId().equals(post.getId()));
        userRepository.save(author);
    }

}
