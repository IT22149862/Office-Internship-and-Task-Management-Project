package com.internship.management.dto;

import com.internship.management.model.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskStatusUpdateRequest {
    @NotNull
    private TaskStatus status;
}
