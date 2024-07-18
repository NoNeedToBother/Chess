package ru.kpfu.itis.paramonov.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.converters.posts.CommentConverter;
import ru.kpfu.itis.paramonov.dto.social.CommentDto;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.model.comment.Comment;
import ru.kpfu.itis.paramonov.model.post.Post;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.CommentRepository;
import ru.kpfu.itis.paramonov.repository.PostRepository;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.repository.UserRoleRepository;
import ru.kpfu.itis.paramonov.service.CommentService;

import java.util.Optional;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.*;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService {

    private CommentRepository commentRepository;

    private UserRepository userRepository;

    private PostRepository postRepository;

    private CommentConverter commentConverter;

    private UserRoleRepository userRoleRepository;

    @Override
    public CommentDto save(Long postId, String content, Long authorId) {
        Optional<User> userOptional = userRepository.findById(authorId);
        Optional<Post> postOptional = postRepository.findById(postId);
        if (userOptional.isPresent()) {
            if (postOptional.isPresent()) {
                User author = userOptional.get();
                Post post = postOptional.get();
                Comment comment = Comment.builder()
                        .author(author)
                        .post(post)
                        .content(content)
                        .build();
                Comment res = commentRepository.saveAndFlush(comment);
                return commentConverter.convert(res);
            } else throw new NotFoundException(NO_POST_FOUND_ERROR);
        } else {
            throw new NotFoundException(NO_USER_FOUND_ERROR);
        }
    }

    @Override
    public void deleteById(Long commentId, Long fromId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (!comment.isPresent()) throw new NotFoundException(NO_COMMENT_FOUND_ERROR);
        if (userRoleRepository.hasModeratorAuthority(fromId)) {
            deleteComment(fromId, comment.get());
        }
        else if (commentRepository.doesBelongToUser(fromId, commentId)) {
            deleteComment(fromId, comment.get());
        } else throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
    }

    public void deleteComment(Long authorId, Comment comment) {
        User author = userRepository.findById(authorId).orElseThrow(
                () -> new NotFoundException(NO_USER_FOUND_ERROR)
        );
        author.getComments().removeIf(c -> c.getId().equals(comment.getId()));
        userRepository.save(author);
        Post post = comment.getPost();
        post.getComments().removeIf(c -> c.getId().equals(comment.getId()));
        postRepository.save(post);
    }
}
