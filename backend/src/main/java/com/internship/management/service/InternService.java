package com.internship.management.service;

import com.internship.management.dto.InternRequest;
import com.internship.management.dto.UserResponse;
import com.internship.management.exception.BadRequestException;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.model.Role;
import com.internship.management.model.User;
import com.internship.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InternService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> findAll(String search, Boolean active) {
        List<User> interns = userRepository.findByRole(Role.INTERN);
        return interns.stream()
                .filter(u -> search == null || search.isBlank()
                        || u.getFullName().toLowerCase().contains(search.toLowerCase())
                        || u.getEmail().toLowerCase().contains(search.toLowerCase()))
                .filter(u -> active == null || u.isActive() == active)
                .map(UserResponse::from)
                .toList();
    }

    public UserResponse findById(String id) {
        return UserResponse.from(getInternOrThrow(id));
    }

    public UserResponse create(InternRequest request) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("A password is required to create an intern account.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.INTERN)
                .phone(request.getPhone())
                .university(request.getUniversity())
                .track(request.getTrack())
                .supervisorNote(request.getSupervisorNote())
                .active(request.getActive() == null || request.getActive())
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse update(String id, InternRequest request) {
        User user = getInternOrThrow(id);

        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getUniversity() != null) user.setUniversity(request.getUniversity());
        if (request.getTrack() != null) user.setTrack(request.getTrack());
        if (request.getSupervisorNote() != null) user.setSupervisorNote(request.getSupervisorNote());
        if (request.getActive() != null) user.setActive(request.getActive());
        user.setUpdatedAt(Instant.now());

        return UserResponse.from(userRepository.save(user));
    }

    public void setActive(String id, boolean active) {
        User user = getInternOrThrow(id);
        user.setActive(active);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    public void delete(String id) {
        User user = getInternOrThrow(id);
        userRepository.delete(user);
    }

    private User getInternOrThrow(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found with id: " + id));
        if (user.getRole() != Role.INTERN) {
            throw new ResourceNotFoundException("Intern not found with id: " + id);
        }
        return user;
    }
}
