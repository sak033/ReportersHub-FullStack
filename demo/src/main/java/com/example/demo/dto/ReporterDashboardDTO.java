package com.example.demo.dto;

import java.util.List;

public class ReporterDashboardDTO {

    private String name;
    private Double averageRating;
    private Long totalRatings;
    private List<ArticleSummaryDTO> myArticles;

    private String profileImageUrl;

    public ReporterDashboardDTO(String name,
                                Double averageRating,
                                Long totalRatings,
                                List<ArticleSummaryDTO> myArticles,
                                String profileImageUrl) {
        this.name = name;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
        this.myArticles = myArticles;
        this.profileImageUrl= profileImageUrl;
    }

    public String getName() { return name; }
    public Double getAverageRating() { return averageRating; }
    public Long getTotalRatings() { return totalRatings; }
    public List<ArticleSummaryDTO> getMyArticles() { return myArticles; }

    public String getProfileImageUrl(){ return profileImageUrl;}
}