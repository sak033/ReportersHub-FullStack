package com.example.demo.dto;

public class TopReporterDTO {

    private Long id;
    private String name;
    private Double averageRating;
    private Long totalRatings;

    public TopReporterDTO(Long id, String name, Double averageRating, Long totalRatings) {
        this.id = id;
        this.name = name;
        this.averageRating = averageRating;
        this.totalRatings= totalRatings;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getAverageRating() { return averageRating; }

    public  Long getTotalRatings(){return totalRatings;}
}