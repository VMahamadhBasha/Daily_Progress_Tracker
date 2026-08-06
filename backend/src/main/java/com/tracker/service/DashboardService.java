package com.tracker.service;

import com.tracker.entity.DailyProgress;
import com.tracker.entity.Task;
import com.tracker.repository.CompletedTaskRepository;
import com.tracker.repository.DailyProgressRepository;
import com.tracker.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DashboardService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private DailyProgressRepository progressRepository;

    @Autowired
    private CompletedTaskRepository completedTaskRepository;

    public Map<String, Object> getDashboardStats() {
        LocalDate today = LocalDate.now();

        // 1. Task Counts
        List<Task> allTasks = taskRepository.findAll();
        long totalTasks = allTasks.stream().filter(t -> !"ARCHIVED".equals(t.getStatus())).count();
        long activeTasks = allTasks.stream().filter(t -> "ACTIVE".equals(t.getStatus())).count();
        long completedTasks = allTasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();

        // 2. Today's progress status
        Optional<DailyProgress> todayProgressOpt = progressRepository.findByDate(today);
        Map<String, Object> todaySummary = new HashMap<>();
        if (todayProgressOpt.isPresent()) {
            DailyProgress dp = todayProgressOpt.get();
            int completedCount = completedTaskRepository.findByProgressId(dp.getId()).size();
            todaySummary.put("logged", true);
            todaySummary.put("studyHours", dp.getStudyHours());
            todaySummary.put("completedCount", completedCount);
            todaySummary.put("notes", dp.getNotes());
        } else {
            todaySummary.put("logged", false);
            todaySummary.put("studyHours", 0.0);
            todaySummary.put("completedCount", 0);
            todaySummary.put("notes", "");
        }

        // 3. Calculate Streak
        int currentStreak = calculateStreak(today);

        // Build Response
        Map<String, Object> stats = new HashMap<>();
        stats.put("todayDate", today.toString());
        stats.put("totalTasks", totalTasks);
        stats.put("activeTasks", activeTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("currentStreak", currentStreak);
        stats.put("todaySummary", todaySummary);

        return stats;
    }

    private int calculateStreak(LocalDate today) {
        int streak = 0;
        LocalDate checkDate = today;

        // Check if there is progress today and if it qualifies
        boolean hasTodayProgress = qualifiesForStreak(checkDate);
        
        if (hasTodayProgress) {
            streak++;
            checkDate = checkDate.minusDays(1);
        } else {
            // If today doesn't qualify, check if yesterday qualifies. 
            // If yesterday doesn't either, streak is 0.
            LocalDate yesterday = today.minusDays(1);
            if (qualifiesForStreak(yesterday)) {
                streak++;
                checkDate = yesterday.minusDays(1);
            } else {
                return 0; // Streak is broken/0
            }
        }

        // Continue checking previous days sequentially
        while (qualifiesForStreak(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }

        return streak;
    }

    private boolean qualifiesForStreak(LocalDate date) {
        Optional<DailyProgress> opt = progressRepository.findByDate(date);
        if (opt.isEmpty()) {
            return false;
        }
        DailyProgress dp = opt.get();
        int completedCount = completedTaskRepository.findByProgressId(dp.getId()).size();
        double hours = dp.getStudyHours() != null ? dp.getStudyHours() : 0.0;

        // Green or Yellow progress qualifies
        return completedCount > 0 || hours > 0.0;
    }
}
