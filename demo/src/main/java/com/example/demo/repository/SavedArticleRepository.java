package com.example.demo.repository;

import com.example.demo.model.SavedArticle;
import com.example.demo.model.User;
import com.example.demo.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface SavedArticleRepository extends JpaRepository<SavedArticle, Long> {

    Optional<SavedArticle> findByUserAndArticle(User user, Article article);

    List<SavedArticle> findByUser(User user);

}