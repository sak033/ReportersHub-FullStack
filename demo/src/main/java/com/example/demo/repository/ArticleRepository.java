package com.example.demo.repository;

import com.example.demo.model.Article;
import com.example.demo.model.ArticleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByStatus(ArticleStatus status);
    List<Article> findByCreatedByIdAndStatus(Long userId, ArticleStatus status);
}