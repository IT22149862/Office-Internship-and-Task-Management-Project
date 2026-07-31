package com.internship.management.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkLogRequest {
    private LocalDate logDate;
    private String completedWork;
    private String currentWork;
    private String challenges;
    private double hoursWorked;
    private String nextDayPlan;
}
