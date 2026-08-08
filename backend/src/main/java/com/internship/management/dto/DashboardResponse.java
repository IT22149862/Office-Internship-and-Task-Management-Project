package com.internship.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long activeInterns;
    private long activeProjects;
    private long pendingTasks;
    private long completedTasks;
    private long overdueTasks;
    private long submittedTasks;
    private long revisionRequiredTasks;
    private List<RecentActivity> recentActivity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String type;
        private String message;
        private String timestamp;
    }
}
