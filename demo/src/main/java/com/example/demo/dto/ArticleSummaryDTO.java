package com.example.demo.dto;

import java.time.LocalDateTime;

public class ArticleSummaryDTO {

    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String status;
    private String imageUrl;
    private String videoUrl;

    public ArticleSummaryDTO(Long id,
                             String title,
                             String content,
                             LocalDateTime createdAt,
                             String status,
                             String imageUrl,
                             String videoUrl) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.status = status;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getStatus() { return status; }
    public String getImageUrl() { return imageUrl; }
    public String getVideoUrl() { return videoUrl; }
}