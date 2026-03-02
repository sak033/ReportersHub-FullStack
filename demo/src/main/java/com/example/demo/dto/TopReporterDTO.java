package com.example.demo.dto;

public class TopReporterDTO {

    private Long id;
    private String name;
    private Double averageRating;
    private Long totalRatings;
    private String profileImageUrl;

    public TopReporterDTO(Long id, String name, Double averageRating, Long totalRatings, String profileImageUrl) {
        this.id = id;
        this.name = name;
        this.averageRating = averageRating;
        this.totalRatings= totalRatings;
        this.profileImageUrl= profileImageUrl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getAverageRating() { return averageRating; }

    public  Long getTotalRatings(){return totalRatings;}

    public String getProfileImageUrl(){return profileImageUrl;}
}