package com.internship.management.controller;

import com.internship.management.dto.InternRequest;
import com.internship.management.dto.UserResponse;
import com.internship.management.service.InternService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interns")
@RequiredArgsConstructor
public class InternController {

    private final InternService internService;

    @GetMapping
    public List<UserResponse> findAll(@RequestParam(required = false) String search,
                                       @RequestParam(required = false) Boolean active) {
        return internService.findAll(search, active);
    }

    @GetMapping("/{id}")
    public UserResponse findById(@PathVariable String id) {
        return internService.findById(id);
    }

    @PostMapping
    public UserResponse create(@Valid @RequestBody InternRequest request) {
        return internService.create(request);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable String id, @RequestBody InternRequest request) {
        return internService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public UserResponse setActive(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        internService.setActive(id, Boolean.TRUE.equals(body.get("active")));
        return internService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        internService.delete(id);
    }
}
