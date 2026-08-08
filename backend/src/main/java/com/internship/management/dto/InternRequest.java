package com.internship.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InternRequest {
    @NotBlank
    private String fullName;

    @NotBlank @Email
    private String email;

    // Required on create, optional on update (leave blank to keep existing password)
    private String password;

    private String phone;
    private String university;
    private String track;
    private String supervisorNote;
    private Boolean active;
}
