package com.internship.management.service;

import com.internship.management.dto.ProjectRequest;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.model.Project;
import com.internship.management.model.ProjectStatus;
import com.internship.management.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> findAll(ProjectStatus status) {
        List<Project> all = projectRepository.findAll();
        if (status == null) return all;
        return all.stream().filter(p -> p.getStatus() == status).toList();
    }

    public List<Project> findForIntern(String internId) {
        return projectRepository.findByAssignedInternIdsContaining(internId);
    }

    public Project findById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project create(ProjectRequest request) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .technology(request.getTechnology())
                .deadline(request.getDeadline())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNED)
                .assignedInternIds(request.getAssignedInternIds() != null ? request.getAssignedInternIds() : new ArrayList<>())
                .build();
        return projectRepository.save(project);
    }

    public Project update(String id, ProjectRequest request) {
        Project project = findById(id);
        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getTechnology() != null) project.setTechnology(request.getTechnology());
        if (request.getDeadline() != null) project.setDeadline(request.getDeadline());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        if (request.getAssignedInternIds() != null) project.setAssignedInternIds(request.getAssignedInternIds());
        project.setUpdatedAt(Instant.now());
        return projectRepository.save(project);
    }

    public void delete(String id) {
        Project project = findById(id);
        projectRepository.delete(project);
    }
}
