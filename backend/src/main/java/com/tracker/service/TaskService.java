package com.tracker.service;

import com.tracker.entity.Task;
import com.tracker.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedDateDesc();
    }

    public Task createTask(Task task) {
        if (task.getCreatedDate() == null) {
            task.setCreatedDate(LocalDate.now());
        }
        if (task.getStatus() == null) {
            task.setStatus("ACTIVE");
        }
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCategory(taskDetails.getCategory());
        task.setPriority(taskDetails.getPriority());
        if (taskDetails.getStatus() != null) {
            task.setStatus(taskDetails.getStatus());
        }
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    public Task completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        if ("COMPLETED".equals(task.getStatus())) {
            task.setStatus("ACTIVE");
        } else {
            task.setStatus("COMPLETED");
        }
        return taskRepository.save(task);
    }

    public Task archiveTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        task.setStatus("ARCHIVED");
        return taskRepository.save(task);
    }
}
