package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.ArticleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

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

    @PreAuthorize("isAuthenticated()")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Article createArticle(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String videoUrl,
            Authentication authentication
    ) throws IOException {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setCreatedBy(user);
        article.setStatus(ArticleStatus.PENDING);
        article.setCreatedAt(LocalDateTime.now());

        // ✅ IMAGE SAVE (only once)
        if (image != null && !image.isEmpty()) {

            String uploadDir = System.getProperty("user.dir") + "/uploads/";

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.write(filePath, image.getBytes());

            article.setImageUrl("/uploads/" + fileName);
        }

        // ✅ VIDEO SAVE
        if (videoUrl != null && !videoUrl.isBlank()) {
            article.setVideoUrl(videoUrl);
        }

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

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reject/{id}")
    public String rejectArticle(@PathVariable Long id) {

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        article.setStatus(ArticleStatus.REJECTED);
        articleRepository.save(article);

        return "Article rejected.";
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<Article> getPendingArticles() {
        return articleRepository.findByStatus(ArticleStatus.PENDING);
    }
    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable Long id) {

        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public Article updateArticle(
            @PathVariable Long id,
            @RequestBody Article updatedArticle,
            Authentication authentication
    ) {

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        // ✅ Only creator can edit
        if (!article.getCreatedBy().getEmail().equals(authentication.getName())) {
            throw new RuntimeException("You cannot edit this article");
        }

        // ✅ Update content
        article.setTitle(updatedArticle.getTitle());
        article.setContent(updatedArticle.getContent());

        // 🔁 IMPORTANT: Always move back to PENDING after edit
        article.setStatus(ArticleStatus.PENDING);

        return articleRepository.save(article);
    }


    @DeleteMapping("/{id}")
    public String deleteArticle(@PathVariable Long id, Authentication authentication) {

        String email = authentication.getName();

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (!article.getCreatedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        articleRepository.delete(article);   // 🔥 CHANGE THIS LINE

        return "Article deleted successfully.";
    }
}