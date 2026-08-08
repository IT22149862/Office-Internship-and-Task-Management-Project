package com.internship.management.controller;

import com.internship.management.dto.AuthResponse;
import com.internship.management.dto.LoginRequest;
import com.internship.management.dto.UserResponse;
import com.internship.management.repository.UserRepository;
import com.internship.management.security.UserPrincipal;
import com.internship.management.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        return UserResponse.from(userRepository.findById(principal.getUser().getId()).orElseThrow());
    }
}
