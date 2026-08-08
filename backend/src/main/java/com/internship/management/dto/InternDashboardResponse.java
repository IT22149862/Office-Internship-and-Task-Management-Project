package com.internship.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternDashboardResponse {
    private long myProjects;
    private long todoTasks;
    private long inProgressTasks;
    private long submittedTasks;
    private long revisionRequiredTasks;
    private long completedTasks;
    private long workLogsThisWeek;
}
