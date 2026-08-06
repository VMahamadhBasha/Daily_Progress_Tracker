package com.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "completed_task")
public class CompletedTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "progress_id", nullable = false)
    private DailyProgress progress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    // Default Constructor
    public CompletedTask() {
    }

    // All Arguments Constructor
    public CompletedTask(Long id, DailyProgress progress, Task task) {
        this.id = id;
        this.progress = progress;
        this.task = task;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DailyProgress getProgress() {
        return progress;
    }

    public void setProgress(DailyProgress progress) {
        this.progress = progress;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    @Override
    public String toString() {
        return "CompletedTask{" +
                "id=" + id +
                ", progress=" + (progress != null ? progress.getId() : null) +
                ", task=" + (task != null ? task.getId() : null) +
                '}';
    }
}
