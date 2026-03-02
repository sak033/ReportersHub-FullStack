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
import com.example.demo.dto.ReporterDashboardDTO;

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
                        a.getContent(),        // 🔥 added
                        a.getCreatedAt(),
                        a.getStatus().name(),
                        a.getImageUrl(),       // 🔥 added
                        a.getVideoUrl()        // 🔥 added
                ))
                .toList();

        // 🔥 ADD THIS
        Double averageRating =
                ratingRepository.findAverageRatingByReporterId(id);

        return new ReporterProfileDTO(
                user.getId(),
                user.getName(),
                averageRating != null ? averageRating : 0.0,
                articleDTOs,
                user.getProfileImageUrl()
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

        List<User> reporters = userRepository.findByRole(Role.REPORTER);

        return reporters.stream()
                .map(reporter -> {

                    Double avg =
                            ratingRepository.findAverageRatingByReporterId(reporter.getId());

                    Long total =
                            ratingRepository.countByReporterId(reporter.getId());

                    return new TopReporterDTO(
                            reporter.getId(),
                            reporter.getName(),
                            avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0,
                            total != null ? total : 0L,
                            reporter.getProfileImageUrl()
                    );
                })
                .sorted((r1, r2) ->
                        Double.compare(r2.getAverageRating(), r1.getAverageRating())
                )
                .toList();
    }
    @PreAuthorize("hasRole('REPORTER')")
    @GetMapping("/dashboard")
    public ReporterDashboardDTO getDashboard(Authentication authentication) {

        String email = authentication.getName();

        User reporter = userRepository.findByEmail(email)
                .orElseThrow();

        // Get all articles (all statuses)
        List<Article> articles =
                articleRepository.findByCreatedById(reporter.getId());

        List<ArticleSummaryDTO> articleDTOs = articles.stream()
                .map(a -> new ArticleSummaryDTO(
                        a.getId(),
                        a.getTitle(),
                        a.getContent(),        // add this
                        a.getCreatedAt(),
                        a.getStatus().name(),
                        a.getImageUrl(),       // add this
                        a.getVideoUrl()        // add this
                ))
                .toList();

        Double avgRating =
                ratingRepository.findAverageRatingByReporterId(reporter.getId());

        Long totalRatings =
                ratingRepository.countByReporterId(reporter.getId());

        return new ReporterDashboardDTO(
                reporter.getName(),
                avgRating != null ? avgRating : 0.0,
                totalRatings != null ? totalRatings : 0L,
                articleDTOs,
                reporter.getProfileImageUrl()

        );
    }
}