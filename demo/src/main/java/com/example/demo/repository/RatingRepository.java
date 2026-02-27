package com.example.demo.repository;

import com.example.demo.model.Rating;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByReporterAndUser(User reporter, User user);

    List<Rating> findByReporter(User reporter);
    @Query("""
   SELECT r.reporter.id, AVG(r.value)
   FROM Rating r
   GROUP BY r.reporter.id
   ORDER BY AVG(r.value) DESC
   """)
    List<Object[]> findTopReporters();

    @Query("SELECT AVG(r.value) FROM Rating r WHERE r.reporter.id = :reporterId")
    Double findAverageRatingByReporterId(@Param("reporterId") Long reporterId);


    @Query("SELECT COUNT(r) FROM Rating r WHERE r.reporter.id = :reporterId")
    Long countByReporterId(@Param("reporterId") Long reporterId);
}