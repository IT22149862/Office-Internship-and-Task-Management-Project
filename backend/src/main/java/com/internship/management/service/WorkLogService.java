package com.internship.management.service;

import com.internship.management.dto.WorkLogFeedbackRequest;
import com.internship.management.dto.WorkLogRequest;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.model.WorkLog;
import com.internship.management.repository.WorkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkLogService {

    private final WorkLogRepository workLogRepository;

    public List<WorkLog> findForIntern(String internId) {
        return workLogRepository.findByInternIdOrderByLogDateDesc(internId);
    }

    public List<WorkLog> findAll() {
        return workLogRepository.findAllByOrderByLogDateDesc();
    }

    public WorkLog create(String internId, WorkLogRequest request) {
        WorkLog log = WorkLog.builder()
                .internId(internId)
                .logDate(request.getLogDate() != null ? request.getLogDate() : LocalDate.now())
                .completedWork(request.getCompletedWork())
                .currentWork(request.getCurrentWork())
                .challenges(request.getChallenges())
                .hoursWorked(request.getHoursWorked())
                .nextDayPlan(request.getNextDayPlan())
                .build();
        return workLogRepository.save(log);
    }

    public WorkLog addFeedback(String id, WorkLogFeedbackRequest request) {
        WorkLog log = workLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work log not found with id: " + id));
        log.setSupervisorFeedback(request.getSupervisorFeedback());
        return workLogRepository.save(log);
    }
}
