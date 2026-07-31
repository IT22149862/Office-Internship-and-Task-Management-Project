package com.internship.management.config;

import com.internship.management.model.Role;
import com.internship.management.model.User;
import com.internship.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-name}")
    private String seedAdminName;

    @Value("${app.seed.admin-email}")
    private String seedAdminEmail;

    @Value("${app.seed.admin-password}")
    private String seedAdminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
            User admin = User.builder()
                    .fullName(seedAdminName)
                    .email(seedAdminEmail)
                    .password(passwordEncoder.encode(seedAdminPassword))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("==============================================================");
            log.info("Seeded default administrator account:");
            log.info("  email:    {}", seedAdminEmail);
            log.info("  password: {}", seedAdminPassword);
            log.info("Change this password after first login.");
            log.info("==============================================================");
        }
    }
}
