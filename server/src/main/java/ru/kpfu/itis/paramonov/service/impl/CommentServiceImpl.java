package ru.kpfu.itis.paramonov.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.converters.posts.CommentConverter;
import ru.kpfu.itis.paramonov.dto.request.UploadCommentRequestDto;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.model.Comment;
import ru.kpfu.itis.paramonov.model.Post;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.CommentRepository;
import ru.kpfu.itis.paramonov.repository.PostRepository;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.repository.UserRoleRepository;
import ru.kpfu.itis.paramonov.service.CommentService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService {

    private CommentRepository commentRepository;

    private UserRepository userRepository;

    private PostRepository postRepository;

    private CommentConverter commentConverter;

    private UserRoleRepository userRoleRepository;

    private final static String USER_NOT_EXISTS_MESSAGE = "User with this id does not exist";

    private final static String POST_NOT_EXISTS_MESSAGE = "Post with this id does not exist";

    @Override
    public CommentDto save(UploadCommentRequestDto uploadCommentRequestDto, Long authorId) {
        Optional<User> userOptional = userRepository.findById(authorId);
        Optional<Post> postOptional = postRepository.findById(uploadCommentRequestDto.getPostId());
        if (userOptional.isPresent()) {
            if (postOptional.isPresent()) {
                User author = userOptional.get();
                Post post = postOptional.get();
                Comment comment = Comment.builder()
                        .author(author)
                        .post(post)
                        .content(uploadCommentRequestDto.getContent())
                        .build();
                Comment res = commentRepository.saveAndFlush(comment);
                return commentConverter.convert(res);
            } else throw new InvalidParameterException(POST_NOT_EXISTS_MESSAGE);
        } else {
            throw new InvalidParameterException(USER_NOT_EXISTS_MESSAGE);
        }
    }

    private static final String NO_SUFFICIENT_AUTHORITY_ERROR = "No sufficient authority to delete this comment";

    private static final String NO_COMMENT_FOUND_ERROR = "No comment was found";

    @Override
    public void deleteById(Long id, Long from) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (!comment.isPresent()) throw new InvalidParameterException(NO_COMMENT_FOUND_ERROR);
        if (userRoleRepository.isModerator(from)) {
            commentRepository.deleteById(id);
            return;
        }
        List<Long> commentIds = userRepository.findById(from).get()
                .getComments()
                .stream()
                .map(Comment::getId)
                .collect(Collectors.toList());
        if (commentIds.contains(id)) {
            commentRepository.deleteById(id);
        } else throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
    }
}
