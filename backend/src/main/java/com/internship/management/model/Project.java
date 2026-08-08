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
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String description;

    private String technology;

    private LocalDate deadline;

    @Builder.Default
    private ProjectStatus status = ProjectStatus.PLANNED;

    @Builder.Default
    private List<String> assignedInternIds = new ArrayList<>();

    @CreatedDate
    private Instant createdAt;

    private Instant updatedAt;
}
