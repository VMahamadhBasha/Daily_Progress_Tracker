package com.tracker.service;

import com.tracker.entity.DailyProgress;
import com.tracker.repository.CompletedTaskRepository;
import com.tracker.repository.DailyProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CalendarService {

    @Autowired
    private DailyProgressRepository progressRepository;

    @Autowired
    private CompletedTaskRepository completedTaskRepository;

    public Map<String, String> getCalendarData() {
        List<DailyProgress> progressList = progressRepository.findAll();
        Map<String, String> calendarMap = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (DailyProgress dp : progressList) {
            int completedTasksCount = completedTaskRepository.findByProgressId(dp.getId()).size();
            double studyHours = dp.getStudyHours() != null ? dp.getStudyHours() : 0.0;

            String status;
            if (completedTasksCount >= 2 || studyHours >= 4.0) {
                status = "GREEN";
            } else if (completedTasksCount == 1 || studyHours > 0.0) {
                status = "YELLOW";
            } else {
                status = "RED";
            }
            calendarMap.put(dp.getDate().format(formatter), status);
        }

        return calendarMap;
    }
}
