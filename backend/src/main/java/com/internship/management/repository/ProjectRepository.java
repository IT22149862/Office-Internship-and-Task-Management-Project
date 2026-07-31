package com.internship.management.repository;

import com.internship.management.model.Project;
import com.internship.management.model.ProjectStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByAssignedInternIdsContaining(String internId);
    long countByStatus(ProjectStatus status);
}
