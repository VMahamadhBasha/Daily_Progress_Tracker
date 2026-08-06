-- MySQL Schema for Student Daily Progress Tracker

CREATE DATABASE IF NOT EXISTS student_tracker;
USE student_tracker;

-- Drop tables if they exist to start fresh (in order of dependencies)
DROP TABLE IF EXISTS completed_task;
DROP TABLE IF EXISTS daily_progress;
DROP TABLE IF EXISTS task;

-- 1. Task Table
CREATE TABLE task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_date DATE NOT NULL
);

-- 2. Daily Progress Table
CREATE TABLE daily_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    notes TEXT,
    study_hours DOUBLE DEFAULT 0.0
);

-- 3. Completed Task Junction Table
CREATE TABLE completed_task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    progress_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    FOREIGN KEY (progress_id) REFERENCES daily_progress(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE
);
