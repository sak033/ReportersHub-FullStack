package com.example.demo.dto;

import java.util.List;

public class ReporterDashboardDTO {

    private String name;
    private Double averageRating;
    private Long totalRatings;
    private List<ArticleSummaryDTO> myArticles;

    public ReporterDashboardDTO(String name,
                                Double averageRating,
                                Long totalRatings,
                                List<ArticleSummaryDTO> myArticles) {
        this.name = name;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
        this.myArticles = myArticles;
    }

    public String getName() { return name; }
    public Double getAverageRating() { return averageRating; }
    public Long getTotalRatings() { return totalRatings; }
    public List<ArticleSummaryDTO> getMyArticles() { return myArticles; }
}