package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public CommentController(CommentRepository commentRepository,
                             ArticleRepository articleRepository,
                             UserRepository userRepository) {

        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    // get comments for article
    @GetMapping("/{articleId}")
    public List<Comment> getComments(@PathVariable Long articleId) {
        return commentRepository.findByArticleIdOrderByCreatedAtDesc(articleId);
    }

    // add comment
    @PostMapping("/{articleId}")
    public Comment addComment(@PathVariable Long articleId,
                              @RequestBody String content,
                              Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        Article article = articleRepository
                .findById(articleId)
                .orElseThrow();

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setArticle(article);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        String email = authentication.getName();

        if (!comment.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        commentRepository.delete(comment);

        return ResponseEntity.ok("Comment deleted");
    }
}