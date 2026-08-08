package com.internship.management.service;

import com.internship.management.dto.DashboardResponse;
import com.internship.management.dto.InternDashboardResponse;
import com.internship.management.model.Project;
import com.internship.management.model.ProjectStatus;
import com.internship.management.model.Role;
import com.internship.management.model.Task;
import com.internship.management.model.TaskStatus;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.repository.TaskRepository;
import com.internship.management.repository.UserRepository;
import com.internship.management.repository.WorkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final WorkLogRepository workLogRepository;

    public DashboardResponse getAdminDashboard() {
        long activeInterns = userRepository.countByRoleAndActiveTrue(Role.INTERN);
        long activeProjects = projectRepository.countByStatus(ProjectStatus.ACTIVE);

        List<Task> tasks = taskRepository.findAll();
        long pending = tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO || t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long completed = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long submitted = tasks.stream().filter(t -> t.getStatus() == TaskStatus.SUBMITTED).count();
        long revision = tasks.stream().filter(t -> t.getStatus() == TaskStatus.REVISION_REQUIRED).count();
        long overdue = tasks.stream()
                .filter(t -> t.getDeadline() != null && t.getDeadline().isBefore(LocalDate.now()) && t.getStatus() != TaskStatus.COMPLETED)
                .count();

        List<DashboardResponse.RecentActivity> recent = tasks.stream()
                .filter(t -> t.getUpdatedAt() != null || t.getCreatedAt() != null)
                .sorted(Comparator.comparing((Task t) -> t.getUpdatedAt() != null ? t.getUpdatedAt() : t.getCreatedAt()).reversed())
                .limit(8)
                .map(t -> DashboardResponse.RecentActivity.builder()
                        .type("TASK")
                        .message(describeTask(t))
                        .timestamp(DateTimeFormatter.ISO_INSTANT.format(t.getUpdatedAt() != null ? t.getUpdatedAt() : t.getCreatedAt()))
                        .build())
                .toList();

        return DashboardResponse.builder()
                .activeInterns(activeInterns)
                .activeProjects(activeProjects)
                .pendingTasks(pending)
                .completedTasks(completed)
                .submittedTasks(submitted)
                .revisionRequiredTasks(revision)
                .overdueTasks(overdue)
                .recentActivity(recent)
                .build();
    }

    public InternDashboardResponse getInternDashboard(String internId) {
        List<Project> myProjects = projectRepository.findByAssignedInternIdsContaining(internId);
        List<Task> myTasks = taskRepository.findByAssignedInternId(internId);

        long todo = myTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long inProgress = myTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long submitted = myTasks.stream().filter(t -> t.getStatus() == TaskStatus.SUBMITTED).count();
        long revision = myTasks.stream().filter(t -> t.getStatus() == TaskStatus.REVISION_REQUIRED).count();
        long completed = myTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();

        LocalDate weekAgo = LocalDate.now().minusDays(7);
        long logsThisWeek = workLogRepository.findByInternIdOrderByLogDateDesc(internId).stream()
                .filter(l -> !l.getLogDate().isBefore(weekAgo))
                .count();

        return InternDashboardResponse.builder()
                .myProjects(myProjects.size())
                .todoTasks(todo)
                .inProgressTasks(inProgress)
                .submittedTasks(submitted)
                .revisionRequiredTasks(revision)
                .completedTasks(completed)
                .workLogsThisWeek(logsThisWeek)
                .build();
    }

    private String describeTask(Task t) {
        return switch (t.getStatus()) {
            case TODO -> "Task \"" + t.getTitle() + "\" is queued.";
            case IN_PROGRESS -> "Task \"" + t.getTitle() + "\" is in progress.";
            case SUBMITTED -> "Task \"" + t.getTitle() + "\" was submitted for review.";
            case REVISION_REQUIRED -> "Task \"" + t.getTitle() + "\" needs revision.";
            case COMPLETED -> "Task \"" + t.getTitle() + "\" was approved and completed.";
        };
    }
}
