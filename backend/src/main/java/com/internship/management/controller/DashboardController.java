package com.internship.management.controller;

import com.internship.management.dto.DashboardResponse;
import com.internship.management.dto.InternDashboardResponse;
import com.internship.management.security.UserPrincipal;
import com.internship.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardResponse admin() {
        return dashboardService.getAdminDashboard();
    }

    @GetMapping("/intern")
    public InternDashboardResponse intern(@AuthenticationPrincipal UserPrincipal principal) {
        return dashboardService.getInternDashboard(principal.getUser().getId());
    }
}
