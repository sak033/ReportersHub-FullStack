package com.example.demo.controller;

import com.example.demo.model.ReporterStatus;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.model.Role;
import org.springframework.security.crypto.password.PasswordEncoder;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @PostMapping
    public User createUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        user.setReporterStatus(ReporterStatus.NONE);
        return userRepository.save(user);


    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/test")
    public String test() {
        return "Working";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            return "User not found with id: " + id;
        }

        userRepository.deleteById(id);
        return "User deleted successfully!";
    }

    @DeleteMapping("/cleanup/null-users")
    public String deleteNullUsers() {

        List<User> users = userRepository.findAll();

        int count = 0;

        for (User user : users) {
            if (user.getName() == null && user.getEmail() == null) {
                userRepository.delete(user);
                count++;
            }
        }

        return count + " null users deleted.";
    }

    @GetMapping("/me")
    public User getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    @PutMapping("/request-reporter")
    public String requestReporter(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // prevent multiple requests
        if (user.getReporterStatus() == ReporterStatus.PENDING) {
            return "Request already pending.";
        }

        if (user.getRole() == Role.REPORTER) {
            return "You are already a reporter.";
        }

        user.setReporterStatus(ReporterStatus.PENDING);
        userRepository.save(user);

        return "Reporter request sent for admin approval.";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve-reporter/{id}")
    public String approveReporter(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getReporterStatus() != ReporterStatus.PENDING) {
            return "User has not requested reporter role.";
        }

        user.setRole(Role.REPORTER);
        user.setReporterStatus(ReporterStatus.APPROVED);

        userRepository.save(user);

        return "User promoted to REPORTER successfully.";
    }
}