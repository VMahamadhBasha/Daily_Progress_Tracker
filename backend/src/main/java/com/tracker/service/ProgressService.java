package com.tracker.service;

import com.tracker.entity.CompletedTask;
import com.tracker.entity.DailyProgress;
import com.tracker.entity.Task;
import com.tracker.repository.CompletedTaskRepository;
import com.tracker.repository.DailyProgressRepository;
import com.tracker.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    @Autowired
    private DailyProgressRepository progressRepository;

    @Autowired
    private CompletedTaskRepository completedTaskRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<DailyProgress> getAllProgress() {
        List<DailyProgress> list = progressRepository.findAllByOrderByDateDesc();
        for (DailyProgress dp : list) {
            populateCompletedTaskIds(dp);
        }
        return list;
    }

    public DailyProgress getProgressByDate(LocalDate date) {
        Optional<DailyProgress> opt = progressRepository.findByDate(date);
        if (opt.isPresent()) {
            DailyProgress dp = opt.get();
            populateCompletedTaskIds(dp);
            return dp;
        } else {
            // Return empty progress record for that date (beginner friendly, no 404 block)
            DailyProgress dp = new DailyProgress();
            dp.setDate(date);
            dp.setNotes("");
            dp.setStudyHours(0.0);
            dp.setCompletedTaskIds(new ArrayList<>());
            return dp;
        }
    }

    @Transactional
    public DailyProgress saveProgress(DailyProgress progress) {
        // Find existing progress by date or create new
        DailyProgress existing = progressRepository.findByDate(progress.getDate())
                .orElse(null);

        if (existing == null) {
            existing = new DailyProgress();
            existing.setDate(progress.getDate());
        }
        
        existing.setNotes(progress.getNotes());
        existing.setStudyHours(progress.getStudyHours() != null ? progress.getStudyHours() : 0.0);
        
        DailyProgress savedProgress = progressRepository.save(existing);
        
        // Synch completed tasks
        List<Long> newIds = progress.getCompletedTaskIds();
        if (newIds == null) {
            newIds = new ArrayList<>();
        }

        // Fetch current completed tasks for this progress
        List<CompletedTask> currentLinks = completedTaskRepository.findByProgressId(savedProgress.getId());
        List<Long> currentIds = currentLinks.stream()
                .map(link -> link.getTask().getId())
                .collect(Collectors.toList());

        // 1. Delete links and set task status to 'ACTIVE' for tasks that were unchecked
        for (CompletedTask link : currentLinks) {
            Long tid = link.getTask().getId();
            if (!newIds.contains(tid)) {
                completedTaskRepository.delete(link);
                // Reset status to ACTIVE if it was COMPLETED
                Task task = link.getTask();
                if ("COMPLETED".equals(task.getStatus())) {
                    task.setStatus("ACTIVE");
                    taskRepository.save(task);
                }
            }
        }

        // 2. Add new links and update their status to 'COMPLETED'
        for (Long tid : newIds) {
            if (!currentIds.contains(tid)) {
                Optional<Task> optTask = taskRepository.findById(tid);
                if (optTask.isPresent()) {
                    Task task = optTask.get();
                    
                    CompletedTask newLink = new CompletedTask();
                    newLink.setProgress(savedProgress);
                    newLink.setTask(task);
                    completedTaskRepository.save(newLink);

                    // Update task status to COMPLETED
                    task.setStatus("COMPLETED");
                    taskRepository.save(task);
                }
            }
        }

        // Re-populate and return
        populateCompletedTaskIds(savedProgress);
        return savedProgress;
    }

    private void populateCompletedTaskIds(DailyProgress dp) {
        List<CompletedTask> links = completedTaskRepository.findByProgressId(dp.getId());
        List<Long> ids = links.stream()
                .map(link -> link.getTask().getId())
                .collect(Collectors.toList());
        dp.setCompletedTaskIds(ids);
    }
}
