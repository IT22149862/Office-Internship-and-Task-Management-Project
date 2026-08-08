package com.internship.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskFeedbackRequest {
    @NotNull
    private Boolean approved; // true = mark COMPLETED, false = REVISION_REQUIRED
    private String comment;
}
