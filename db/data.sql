-- Sample Data for Student Daily Progress Tracker
USE student_tracker;

-- Insert some long-term tasks
INSERT INTO task (title, description, category, priority, status, created_date) VALUES
('Learn Java OOP Concepts', 'Understand polymorphism, inheritance, encapsulation, and abstraction with practical examples.', 'Java', 'HIGH', 'ACTIVE', '2026-08-01'),
('Complete Spring Boot Core Modules', 'Dependency injection, Bean lifecycle, Spring Boot configuration, and Spring Data JPA.', 'Spring Boot', 'HIGH', 'ACTIVE', '2026-08-01'),
('ServiceNow CAD Exam Prep', 'Go through the developer portal learning path, revise Client Scripts and Business Rules.', 'ServiceNow', 'MEDIUM', 'ACTIVE', '2026-08-02'),
('LeetCode 50 DSA Challenge', 'Solve 50 curated problems focusing on arrays, strings, trees, and dynamic programming.', 'DSA', 'HIGH', 'ACTIVE', '2026-08-02'),
('Build AI Resume Parser', 'Create a small Python FastAPI application using spaCy or LangChain to parse PDF resumes.', 'AI Project', 'LOW', 'ACTIVE', '2026-08-03'),
('Read Clean Code Chapter 1-5', 'Focus on meaningful names, functions, comments, and formatting.', 'General', 'MEDIUM', 'COMPLETED', '2026-08-01'),
('Archive Old JavaScript Project', 'A tiny vanilla js project that is no longer relevant.', 'Web Dev', 'LOW', 'ARCHIVED', '2026-08-01');

-- Insert daily progress records
-- August 3, 2026 (Good Progress: 2 completed tasks, 4 hours study)
INSERT INTO daily_progress (id, date, notes, study_hours) VALUES
(1, '2026-08-03', 'Completed Clean Code reading. Studied Java inheritance and polymorphism.', 4.5);

-- August 4, 2026 (Partial Progress: 0 tasks completed but 2 hours study)
INSERT INTO daily_progress (id, date, notes, study_hours) VALUES
(2, '2026-08-04', 'Did ServiceNow CAD modules on Client Scripts. No tasks marked fully complete.', 2.0);

-- August 5, 2026 (Good Progress: 2 completed tasks, 5 hours study)
INSERT INTO daily_progress (id, date, notes, study_hours) VALUES
(3, '2026-08-05', 'Completed the DSA recursion questions. Did 2 hours of AI resume parser setup.', 5.0);

-- August 6, 2026 (Good Progress: Today's progress so far)
INSERT INTO daily_progress (id, date, notes, study_hours) VALUES
(4, '2026-08-06', 'Worked on Spring Boot project structure. Setting up React calendar component.', 4.0);

-- Insert completed task links
-- August 3 completed Task 6 (Clean Code)
INSERT INTO completed_task (progress_id, task_id) VALUES (1, 6);

-- August 5 completed Task 4 (DSA)
INSERT INTO completed_task (progress_id, task_id) VALUES (3, 4);

-- August 6 completed Task 2 (Spring Boot Core)
INSERT INTO completed_task (progress_id, task_id) VALUES (4, 2);

-- Adjust AUTO_INCREMENT sequences to prevent primary key conflicts in JPA
ALTER TABLE task AUTO_INCREMENT = 8;
ALTER TABLE daily_progress AUTO_INCREMENT = 5;

