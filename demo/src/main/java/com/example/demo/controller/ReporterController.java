package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.ArticleRepository;
import com.example.demo.repository.UserRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.ArticleSummaryDTO;
import com.example.demo.dto.ReporterProfileDTO;
import com.example.demo.repository.RatingRepository;
import com.example.demo.dto.TopReporterDTO;

import java.util.List;
import java.util.Optional;



@RestController
@RequestMapping("/reporters")
public class ReporterController {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private  final  RatingRepository ratingRepository;

    public ReporterController(UserRepository userRepository,
                              ArticleRepository articleRepository,
                              RatingRepository ratingRepository) {
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
        this.ratingRepository= ratingRepository;
    }

    @GetMapping("/{id}")
    public ReporterProfileDTO getReporterProfile(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        if (user.getRole() != Role.REPORTER) {
            throw new RuntimeException("User is not a reporter");
        }

        List<Article> articles =
                articleRepository.findByCreatedByIdAndStatus(
                        id,
                        ArticleStatus.APPROVED
                );

        List<ArticleSummaryDTO> articleDTOs = articles.stream()
                .map(a -> new ArticleSummaryDTO(
                        a.getId(),
                        a.getTitle(),
                        a.getCreatedAt()
                ))
                .toList();

        return new ReporterProfileDTO(
                user.getId(),
                user.getName(),
                articleDTOs
        );
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/rate")
    public String rateReporter(@PathVariable Long id,
                               @RequestParam int value,
                               Authentication authentication) {

        if (value < 1 || value > 5) {
            return "Rating must be between 1 and 5.";
        }

        User reporter = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        if (reporter.getRole() != Role.REPORTER) {
            return "User is not a reporter.";
        }

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        Optional<Rating> existing =
                ratingRepository.findByReporterAndUser(reporter, currentUser);

        if (existing.isPresent()) {
            existing.get().setValue(value);
            ratingRepository.save(existing.get());
            return "Rating updated.";
        }

        Rating rating = new Rating();
        rating.setReporter(reporter);
        rating.setUser(currentUser);
        rating.setValue(value);

        ratingRepository.save(rating);

        return "Rating submitted.";
    }

    @GetMapping("/top")
    public List<TopReporterDTO> getTopReporters() {

        List<Object[]> results = ratingRepository.findTopReporters();

        return results.stream()
                .map(r -> {
                    Long reporterId = (Long) r[0];
                    Double avgRating = (Double) r[1];

                    User reporter = userRepository.findById(reporterId)
                            .orElseThrow();

                    return new TopReporterDTO(
                            reporterId,
                            reporter.getName(),
                            Math.round(avgRating * 10.0) / 10.0
                    );
                })
                .toList();
    }
}