package com.internship.management.controller;

import com.internship.management.dto.TaskFeedbackRequest;
import com.internship.management.dto.TaskRequest;
import com.internship.management.dto.TaskStatusUpdateRequest;
import com.internship.management.dto.TaskSubmissionRequest;
import com.internship.management.model.Role;
import com.internship.management.model.Task;
import com.internship.management.model.TaskStatus;
import com.internship.management.security.UserPrincipal;
import com.internship.management.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<Task> findAll(@AuthenticationPrincipal UserPrincipal principal,
                               @RequestParam(required = false) String projectId,
                               @RequestParam(required = false) String internId,
                               @RequestParam(required = false) TaskStatus status) {
        if (principal.getUser().getRole() == Role.INTERN) {
            return taskService.findAll(projectId, principal.getUser().getId(), status);
        }
        return taskService.findAll(projectId, internId, status);
    }

    @GetMapping("/{id}")
    public Task findById(@PathVariable String id) {
        return taskService.findById(id);
    }

    @PostMapping
    public Task create(@Valid @RequestBody TaskRequest request) {
        return taskService.create(request);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable String id, @RequestBody TaskRequest request) {
        return taskService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable String id,
                              @Valid @RequestBody TaskStatusUpdateRequest request,
                              @AuthenticationPrincipal UserPrincipal principal) {
        String internGuard = principal.getUser().getRole() == Role.INTERN ? principal.getUser().getId() : null;
        return taskService.updateStatus(id, request, internGuard);
    }

    @PostMapping("/{id}/submit")
    public Task submit(@PathVariable String id,
                        @RequestBody TaskSubmissionRequest request,
                        @AuthenticationPrincipal UserPrincipal principal) {
        String internGuard = principal.getUser().getRole() == Role.INTERN ? principal.getUser().getId() : null;
        return taskService.submit(id, request, internGuard);
    }

    @PostMapping("/{id}/feedback")
    public Task giveFeedback(@PathVariable String id,
                              @Valid @RequestBody TaskFeedbackRequest request,
                              @AuthenticationPrincipal UserPrincipal principal) {
        return taskService.giveFeedback(id, request, principal.getUser().getId());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        taskService.delete(id);
    }
}
