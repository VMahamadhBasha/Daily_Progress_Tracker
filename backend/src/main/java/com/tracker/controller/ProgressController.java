package com.tracker.controller;

import com.tracker.entity.DailyProgress;
import com.tracker.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping
    public List<DailyProgress> getAllProgress() {
        return progressService.getAllProgress();
    }

    @PostMapping
    public DailyProgress saveProgress(@RequestBody DailyProgress progress) {
        return progressService.saveProgress(progress);
    }

    @GetMapping("/{date}")
    public DailyProgress getProgressByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return progressService.getProgressByDate(localDate);
    }
}
