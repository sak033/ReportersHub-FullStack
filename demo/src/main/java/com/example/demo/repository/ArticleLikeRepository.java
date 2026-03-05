package com.example.demo.repository;

import com.example.demo.model.Article;
import com.example.demo.model.ArticleLike;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Long> {

    Optional<ArticleLike> findByUserAndArticle(User user, Article article);

    long countByArticle(Article article);
}