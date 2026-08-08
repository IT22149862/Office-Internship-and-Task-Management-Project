package com.internship.management.service;

import com.internship.management.dto.TaskFeedbackRequest;
import com.internship.management.dto.TaskRequest;
import com.internship.management.dto.TaskStatusUpdateRequest;
import com.internship.management.dto.TaskSubmissionRequest;
import com.internship.management.exception.BadRequestException;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.model.Task;
import com.internship.management.model.TaskPriority;
import com.internship.management.model.TaskStatus;
import com.internship.management.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> findAll(String projectId, String internId, TaskStatus status) {
        List<Task> all = taskRepository.findAll();
        return all.stream()
                .filter(t -> projectId == null || projectId.equals(t.getProjectId()))
                .filter(t -> internId == null || internId.equals(t.getAssignedInternId()))
                .filter(t -> status == null || status == t.getStatus())
                .toList();
    }

    public List<Task> findForIntern(String internId) {
        return taskRepository.findByAssignedInternId(internId);
    }

    public Task findById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task create(TaskRequest request) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .projectId(request.getProjectId())
                .assignedInternId(request.getAssignedInternId())
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .deadline(request.getDeadline())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .build();
        return taskRepository.save(task);
    }

    public Task update(String id, TaskRequest request) {
        Task task = findById(id);
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getProjectId() != null) task.setProjectId(request.getProjectId());
        if (request.getAssignedInternId() != null) task.setAssignedInternId(request.getAssignedInternId());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDeadline() != null) task.setDeadline(request.getDeadline());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        task.setUpdatedAt(Instant.now());
        return taskRepository.save(task);
    }

    public Task updateStatus(String id, TaskStatusUpdateRequest request, String requestingInternId) {
        Task task = findById(id);
        guardInternOwnership(task, requestingInternId);
        task.setStatus(request.getStatus());
        task.setUpdatedAt(Instant.now());
        return taskRepository.save(task);
    }

    public Task submit(String id, TaskSubmissionRequest request, String requestingInternId) {
        Task task = findById(id);
        guardInternOwnership(task, requestingInternId);

        if ((request.getSubmissionRepoLink() == null || request.getSubmissionRepoLink().isBlank())
                && (request.getSubmissionDocLink() == null || request.getSubmissionDocLink().isBlank())
                && (request.getSubmissionNotes() == null || request.getSubmissionNotes().isBlank())) {
            throw new BadRequestException("Provide a repository link, document link, or completion notes before submitting.");
        }

        task.setSubmissionRepoLink(request.getSubmissionRepoLink());
        task.setSubmissionDocLink(request.getSubmissionDocLink());
        task.setSubmissionNotes(request.getSubmissionNotes());
        task.setSubmittedAt(Instant.now());
        task.setStatus(TaskStatus.SUBMITTED);
        // Clear any previous feedback since this is a fresh submission
        task.setFeedbackComment(null);
        task.setApproved(null);
        task.setUpdatedAt(Instant.now());
        return taskRepository.save(task);
    }

    public Task giveFeedback(String id, TaskFeedbackRequest request, String supervisorId) {
        Task task = findById(id);
        if (task.getStatus() != TaskStatus.SUBMITTED) {
            throw new BadRequestException("Only submitted tasks can receive review feedback.");
        }
        task.setApproved(request.getApproved());
        task.setFeedbackComment(request.getComment());
        task.setFeedbackAt(Instant.now());
        task.setFeedbackByUserId(supervisorId);
        task.setStatus(Boolean.TRUE.equals(request.getApproved()) ? TaskStatus.COMPLETED : TaskStatus.REVISION_REQUIRED);
        task.setUpdatedAt(Instant.now());
        return taskRepository.save(task);
    }

    public void delete(String id) {
        Task task = findById(id);
        taskRepository.delete(task);
    }

    public List<Task> findOverdue() {
        return taskRepository.findByDeadlineBeforeAndStatusNot(LocalDate.now(), TaskStatus.COMPLETED);
    }

    private void guardInternOwnership(Task task, String requestingInternId) {
        if (requestingInternId != null && !requestingInternId.equals(task.getAssignedInternId())) {
            throw new BadRequestException("You can only update tasks assigned to you.");
        }
    }
}
