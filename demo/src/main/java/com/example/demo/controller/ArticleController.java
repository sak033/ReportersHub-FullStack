package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.ArticleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleController(ArticleRepository articleRepository,
                             UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('REPORTER')")
    @PostMapping
    public Article createArticle(@RequestBody Article article,
                                 Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        article.setCreatedBy(user);
        article.setStatus(ArticleStatus.PENDING);
        article.setCreatedAt(LocalDateTime.now());

        return articleRepository.save(article);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public String approveArticle(@PathVariable Long id) {

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        article.setStatus(ArticleStatus.APPROVED);
        articleRepository.save(article);

        return "Article approved successfully.";
    }
    @GetMapping("/public")
    public List<Article> getApprovedArticles() {
        return articleRepository.findByStatus(ArticleStatus.APPROVED);
    }
}