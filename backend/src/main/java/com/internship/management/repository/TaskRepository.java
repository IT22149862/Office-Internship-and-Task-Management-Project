package com.internship.management.repository;

import com.internship.management.model.Task;
import com.internship.management.model.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssignedInternId(String internId);
    List<Task> findByProjectId(String projectId);
    List<Task> findByStatus(TaskStatus status);
    long countByStatus(TaskStatus status);
    long countByAssignedInternIdAndStatus(String internId, TaskStatus status);
    List<Task> findByDeadlineBeforeAndStatusNot(LocalDate date, TaskStatus status);
}
