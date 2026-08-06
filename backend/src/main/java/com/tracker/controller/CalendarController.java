package com.tracker.controller;

import com.tracker.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping
    public Map<String, String> getCalendarData() {
        return calendarService.getCalendarData();
    }
}
