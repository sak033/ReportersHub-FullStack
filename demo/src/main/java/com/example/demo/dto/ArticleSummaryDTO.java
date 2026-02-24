package com.example.demo.dto;

import java.time.LocalDateTime;

public class ArticleSummaryDTO {

    private Long id;
    private String title;
    private LocalDateTime createdAt;

    public ArticleSummaryDTO(Long id, String title, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}