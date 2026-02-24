package com.example.demo.dto;

import java.util.List;

public class ReporterProfileDTO {

    private Long id;
    private String name;
    private List<ArticleSummaryDTO> approvedArticles;

    public ReporterProfileDTO(Long id, String name,
                              List<ArticleSummaryDTO> approvedArticles) {
        this.id = id;
        this.name = name;
        this.approvedArticles = approvedArticles;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public List<ArticleSummaryDTO> getApprovedArticles() {
        return approvedArticles;
    }
}