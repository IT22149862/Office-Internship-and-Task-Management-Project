package com.internship.management.dto;

import com.internship.management.model.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectRequest {
    @NotBlank
    private String name;
    private String description;
    private String technology;
    private LocalDate deadline;
    private ProjectStatus status;
    private List<String> assignedInternIds;
}
