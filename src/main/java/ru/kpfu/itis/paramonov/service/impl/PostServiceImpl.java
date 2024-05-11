package ru.kpfu.itis.paramonov.service.impl;

import com.cloudinary.Cloudinary;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.converters.posts.CommentConverter;
import ru.kpfu.itis.paramonov.converters.posts.PostConverter;
import ru.kpfu.itis.paramonov.dto.request.UploadPostRequestDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.model.Post;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.PostRepository;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.service.PostService;

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

@Service
@AllArgsConstructor
public class PostServiceImpl implements PostService {

    private PostRepository postRepository;

    private UserRepository userRepository;

    private PostConverter postConverter;

    private CommentConverter commentConverter;

    private Cloudinary cloudinary;

    @Override
    public List<PostDto> getAll() {
        return postRepository
                .findAll()
                .stream().map( post ->
                        postConverter.convert(post)
                )
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PostDto> getById(long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return Optional.empty();
        } else {
            return Optional.ofNullable(postConverter.convert(post));
        }
    }

    @Override
    public Optional<PostDto> getByTitle(String title) {
        Post post = postRepository.findByTitle(title);
        return Optional.ofNullable(postConverter.convert(post));
    }

    private final static String POST_EXISTS_ERROR = "Post with this title already exists";

    @Override
    public PostDto save(UploadPostRequestDto uploadPostRequestDto) {
        User poster = userRepository.findById(
                uploadPostRequestDto.getAuthorId()
        ).orElseThrow(RuntimeException::new);
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

}
