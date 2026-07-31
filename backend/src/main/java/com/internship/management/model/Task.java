package com.internship.management.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    @NotBlank
    private String title;

    private String description;

    private String projectId;

    private String assignedInternId;

    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    private LocalDate deadline;

    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    // Submission details, filled in by the intern
    private String submissionRepoLink;
    private String submissionDocLink;
    private String submissionNotes;
    private Instant submittedAt;

    // Supervisor feedback
    private String feedbackComment;
    private Boolean approved;
    private Instant feedbackAt;
    private String feedbackByUserId;

    @CreatedDate
    private Instant createdAt;

    private Instant updatedAt;
}
