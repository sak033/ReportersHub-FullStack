package com.example.demo.dto;

import java.util.List;

public class ReporterProfileDTO {

    private Long id;
    private String name;
    private Double averageRating;
    private List<ArticleSummaryDTO> approvedArticles;
    private String profileImageUrl;

    public ReporterProfileDTO(Long id, String name,
                              Double averageRating,
                              List<ArticleSummaryDTO> approvedArticles,
                              String profileImageUrl) {
        this.id = id;
        this.name = name;
        this.approvedArticles = approvedArticles;
        this.averageRating= averageRating;
        this.profileImageUrl= profileImageUrl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getAverageRating(){return averageRating; }
    public List<ArticleSummaryDTO> getApprovedArticles() {
        return approvedArticles;
    }
    public  String getProfileImageUrl(){return profileImageUrl;}
}