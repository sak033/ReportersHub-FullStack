package com.example.demo.dto;

public class TopReporterDTO {

    private Long id;
    private String name;
    private Double averageRating;

    public TopReporterDTO(Long id, String name, Double averageRating) {
        this.id = id;
        this.name = name;
        this.averageRating = averageRating;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getAverageRating() { return averageRating; }
}