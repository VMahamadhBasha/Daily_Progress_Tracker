package com.tracker.repository;

import com.tracker.entity.DailyProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface DailyProgressRepository extends JpaRepository<DailyProgress, Long> {
    Optional<DailyProgress> findByDate(LocalDate date);
    List<DailyProgress> findAllByOrderByDateAsc();
    List<DailyProgress> findAllByOrderByDateDesc();
}
