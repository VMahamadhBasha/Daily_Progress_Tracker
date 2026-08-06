package com.tracker.repository;

import com.tracker.entity.CompletedTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompletedTaskRepository extends JpaRepository<CompletedTask, Long> {
    List<CompletedTask> findByProgressId(Long progressId);
    List<CompletedTask> findByTaskId(Long taskId);
    void deleteByProgressId(Long progressId);
}
