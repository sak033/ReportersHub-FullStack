package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"reporter_id", "user_id"})
})
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int value; // 1-5

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ===== GETTERS =====

    public Long getId() {
        return id;
    }

    public int getValue() {
        return value;
    }

    public User getReporter() {
        return reporter;
    }

    public User getUser() {
        return user;
    }

    // ===== SETTERS =====

    public void setValue(int value) {
        this.value = value;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public void setUser(User user) {
        this.user = user;
    }
}