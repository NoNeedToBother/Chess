package ru.kpfu.itis.paramonov.service.impl;

import com.cloudinary.Cloudinary;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.exceptions.DeniedRequestException;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.repository.PostRatingRepository;
import ru.kpfu.itis.paramonov.service.PostService;
import ru.kpfu.itis.paramonov.converters.posts.CommentConverter;
import ru.kpfu.itis.paramonov.converters.posts.PostConverter;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.model.post.Post;
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
    public Page<PostDto> getAll(Pageable pageable) {
        return postRepository
                .findAll(pageable)
                .map( post -> {
                    PostDto dto = postConverter.convert(post);
                    if (dto != null)
                        dto.setRating(postRatingRepository.getAverageRating(post.getId()));
                    return dto;
                }
                );
    }

    @Override
    public Optional<PostDto> getById(long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return Optional.empty();
        } else {
            PostDto dto = postConverter.convert(post);
            dto.setRating(postRatingRepository.getAverageRating(post.getId()));
            return Optional.of(dto);
        }
    }

    @Override
    public Optional<PostDto> getByTitle(String title) {
        Post post = postRepository.findByTitle(title);
        return Optional.ofNullable(postConverter.convert(post));
    }

    @Override
    public PostDto save(String title, String description, String content, MultipartFile image, Long authorId) {
        User poster = userRepository.findById(authorId).orElseThrow(RuntimeException::new);
        if (!checkTitle(title))
            throw new InvalidParameterException(POST_EXISTS_ERROR);
        try {
            String imageUrl = uploadPostImage(image);
            Post post = Post.builder()
                    .author(poster)
                    .imageUrl(imageUrl)
                    .content(content)
                    .description(description)
                    .title(title)
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
    public PostDto updateRating(Long postId, Integer rating, Long fromId) {
        Optional<Post> post = postRepository.findById(postId);
        User user = userRepository.findById(fromId).orElseThrow(
                () -> new NotFoundException(NO_USER_FOUND_ERROR)
        );
        if (post.isPresent()) {
            if (post.get().getAuthor().getId().equals(fromId)) {
                throw new DeniedRequestException(UPDATE_OWN_POST_DENIED_ERROR);
            }
            if (postRatingRepository.existsByPostAndUser(post.get(), user)) {
                postRatingRepository.updateRating(post.get().getId(), user.getId(), rating);
            } else {
                postRatingRepository.addRating(post.get().getId(), user.getId(), rating);
            }
            return getById(post.get().getId()).orElseThrow(
                    () -> new NotFoundException(NO_POST_FOUND_ERROR)
            );
        } else throw new NotFoundException(NO_POST_FOUND_ERROR);
    }

    @Override
    public Double getAverageRating(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        if (post.isPresent()) {
            return postRatingRepository.getAverageRating(postId);
        } else throw new NotFoundException(NO_POST_FOUND_ERROR);
    }

    @Override
    public Integer getTotalPageAmount(int pageSize) {
        if (pageSize <= 0) throw new InvalidParameterException(INVALID_PARAMETER_SIZE);

        Integer totalPostAmount = postRepository.getTotalAmount();
        if (totalPostAmount % pageSize == 0) return totalPostAmount / pageSize;
        else return postRepository.getTotalAmount() / pageSize + 1;
    }

    private void deletePost(Long authorId, Post post) {
        User author = userRepository.findById(authorId).orElseThrow(
                () -> new NotFoundException(NO_USER_FOUND_ERROR)
        );
        author.getPosts().removeIf(p -> p.getId().equals(post.getId()));
        userRepository.save(author);
    }

}
