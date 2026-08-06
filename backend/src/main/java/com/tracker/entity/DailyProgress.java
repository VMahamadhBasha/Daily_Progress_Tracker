package com.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "daily_progress")
public class DailyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "study_hours")
    private Double studyHours = 0.0;

    @Transient
    private List<Long> completedTaskIds;

    // Default Constructor
    public DailyProgress() {
    }

    // All Arguments Constructor
    public DailyProgress(Long id, LocalDate date, String notes, Double studyHours, List<Long> completedTaskIds) {
        this.id = id;
        this.date = date;
        this.notes = notes;
        this.studyHours = studyHours;
        this.completedTaskIds = completedTaskIds;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Double getStudyHours() {
        return studyHours;
    }

    public void setStudyHours(Double studyHours) {
        this.studyHours = studyHours;
    }

    public List<Long> getCompletedTaskIds() {
        return completedTaskIds;
    }

    public void setCompletedTaskIds(List<Long> completedTaskIds) {
        this.completedTaskIds = completedTaskIds;
    }

    @Override
    public String toString() {
        return "DailyProgress{" +
                "id=" + id +
                ", date=" + date +
                ", notes='" + notes + '\'' +
                ", studyHours=" + studyHours +
                ", completedTaskIds=" + completedTaskIds +
                '}';
    }
}
