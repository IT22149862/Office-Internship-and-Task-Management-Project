package com.internship.management.controller;

import com.internship.management.dto.ProjectRequest;
import com.internship.management.model.Project;
import com.internship.management.model.ProjectStatus;
import com.internship.management.model.Role;
import com.internship.management.security.UserPrincipal;
import com.internship.management.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<Project> findAll(@AuthenticationPrincipal UserPrincipal principal,
                                  @RequestParam(required = false) ProjectStatus status) {
        if (principal.getUser().getRole() == Role.INTERN) {
            return projectService.findForIntern(principal.getUser().getId());
        }
        return projectService.findAll(status);
    }

    @GetMapping("/{id}")
    public Project findById(@PathVariable String id) {
        return projectService.findById(id);
    }

    @PostMapping
    public Project create(@Valid @RequestBody ProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable String id, @RequestBody ProjectRequest request) {
        return projectService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        projectService.delete(id);
    }
}
