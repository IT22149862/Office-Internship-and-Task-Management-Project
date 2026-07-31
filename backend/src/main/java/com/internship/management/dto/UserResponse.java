package com.internship.management.dto;

import com.internship.management.model.Role;
import com.internship.management.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String fullName;
    private String email;
    private Role role;
    private String phone;
    private String university;
    private String track;
    private String supervisorNote;
    private boolean active;
    private Instant createdAt;

    public static UserResponse from(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole())
                .phone(u.getPhone())
                .university(u.getUniversity())
                .track(u.getTrack())
                .supervisorNote(u.getSupervisorNote())
                .active(u.isActive())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
