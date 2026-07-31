package com.internship.management.repository;

import com.internship.management.model.WorkLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WorkLogRepository extends MongoRepository<WorkLog, String> {
    List<WorkLog> findByInternIdOrderByLogDateDesc(String internId);
    List<WorkLog> findAllByOrderByLogDateDesc();
}
