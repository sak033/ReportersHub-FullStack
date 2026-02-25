package com.example.demo.dto;

import java.time.LocalDateTime;

public class ArticleSummaryDTO {

    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private String status;

    public ArticleSummaryDTO(Long id, String title, LocalDateTime createdAt, String status) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.status= status;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public String getStatus(){ return status;}
}