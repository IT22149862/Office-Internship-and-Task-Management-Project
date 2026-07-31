package com.internship.management.dto;

import lombok.Data;

@Data
public class TaskSubmissionRequest {
    private String submissionRepoLink;
    private String submissionDocLink;
    private String submissionNotes;
}
