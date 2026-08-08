package com.internship.management.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "work_logs")
public class WorkLog {

    @Id
    private String id;

    private String internId;

    @Builder.Default
    private LocalDate logDate = LocalDate.now();

    private String completedWork;
    private String currentWork;
    private String challenges;
    private double hoursWorked;
    private String nextDayPlan;

    // Optional supervisor acknowledgement of the log
    private String supervisorFeedback;

    @CreatedDate
    private Instant createdAt;
}
