package com.internship.management.dto;

import com.internship.management.model.TaskPriority;
import com.internship.management.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    private String description;
    private String projectId;
    private String assignedInternId;
    private TaskPriority priority;
    private LocalDate deadline;
    private TaskStatus status;
}
