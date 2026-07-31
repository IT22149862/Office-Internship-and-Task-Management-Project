package com.internship.management.controller;

import com.internship.management.dto.WorkLogFeedbackRequest;
import com.internship.management.dto.WorkLogRequest;
import com.internship.management.model.Role;
import com.internship.management.model.WorkLog;
import com.internship.management.security.UserPrincipal;
import com.internship.management.service.WorkLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worklogs")
@RequiredArgsConstructor
public class WorkLogController {

    private final WorkLogService workLogService;

    @GetMapping
    public List<WorkLog> findAll(@AuthenticationPrincipal UserPrincipal principal,
                                  @RequestParam(required = false) String internId) {
        if (principal.getUser().getRole() == Role.INTERN) {
            return workLogService.findForIntern(principal.getUser().getId());
        }
        if (internId != null) {
            return workLogService.findForIntern(internId);
        }
        return workLogService.findAll();
    }

    @PostMapping
    public WorkLog create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody WorkLogRequest request) {
        return workLogService.create(principal.getUser().getId(), request);
    }

    @PatchMapping("/{id}/feedback")
    public WorkLog addFeedback(@PathVariable String id, @RequestBody WorkLogFeedbackRequest request) {
        return workLogService.addFeedback(id, request);
    }
}
