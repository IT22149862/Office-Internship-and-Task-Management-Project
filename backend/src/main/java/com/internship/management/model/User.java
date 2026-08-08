package com.internship.management.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank
    private String fullName;

    @Indexed(unique = true)
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password; // BCrypt-hashed, never returned to client

    @Builder.Default
    private Role role = Role.INTERN;

    // Intern-specific profile fields
    private String phone;
    private String university;
    private String track; // e.g. Backend, Frontend, Full-Stack, QA
    private String supervisorNote;

    @Builder.Default
    private boolean active = true;

    @CreatedDate
    private Instant createdAt;

    private Instant updatedAt;
}
