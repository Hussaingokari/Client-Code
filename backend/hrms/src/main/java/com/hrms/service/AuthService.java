package com.hrms.service;

import com.hrms.dto.AuthDTOs;
import com.hrms.entity.Employee;
import com.hrms.dto.ChangePasswordRequest;
import com.hrms.enums.Role;
import com.hrms.repository.EmployeeRepository;
import com.hrms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;
    private final UserCacheService userCacheService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticate user with email and password
     */
    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {

        Employee emp;
        try {
            emp = userCacheService.getByEmail(request.getEmail());
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Enforce correct portal based on UI login type
        // UI shows employee portal or admin portal (covers admin+hr both)
        if ("EMPLOYEE".equalsIgnoreCase(request.getLoginType())) {
            if (emp.getRole() != Role.EMPLOYEE) {
                throw new BadCredentialsException(
                    "This account belongs to Admin/HR. Please use the Admin/HR login portal.");
            }
        } else if ("ADMIN".equalsIgnoreCase(request.getLoginType())) {
            if (emp.getRole() == Role.EMPLOYEE) {
                throw new BadCredentialsException(
                    "This account is an Employee account. Please use the Employee login portal.");
            }
        }

        // Authenticate using Spring Security
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Employee authenticated = (Employee) auth.getPrincipal();

        // Build response
        AuthDTOs.AuthResponse response = new AuthDTOs.AuthResponse();
        response.setAccessToken(jwtUtil.generateToken(authenticated));
        response.setRefreshToken(jwtUtil.generateRefreshToken(authenticated));
        response.setRole(authenticated.getRole().name());
        response.setEmployeeId(authenticated.getId());
        response.setEmployeeCode(authenticated.getEmployeeId());
        response.setName(authenticated.getFirstName() + " " + authenticated.getLastName());
        response.setEmail(authenticated.getEmail());
        response.setExpiresIn(jwtUtil.getExpiration());
        return response;
    }

    /**
     * Refresh the access token using refresh token
     */
    public AuthDTOs.AuthResponse refresh(AuthDTOs.RefreshTokenRequest request) {
        
        if (!jwtUtil.validateToken(request.getRefreshToken())) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }
        
        String email = jwtUtil.extractEmail(request.getRefreshToken());
        Employee emp;
        try {
            emp = userCacheService.getByEmail(email);
        } catch (Exception e) {
            throw new BadCredentialsException("User not found");
        }

        // Build response
        AuthDTOs.AuthResponse response = new AuthDTOs.AuthResponse();
        response.setAccessToken(jwtUtil.generateToken(emp));
        response.setRefreshToken(jwtUtil.generateRefreshToken(emp));
        response.setRole(emp.getRole().name());
        response.setEmployeeId(emp.getId());
        response.setEmployeeCode(emp.getEmployeeId());
        response.setName(emp.getFirstName() + " " + emp.getLastName());
        response.setEmail(emp.getEmail());
        response.setExpiresIn(jwtUtil.getExpiration());
        return response;
    }

    /**
     * Change password for the authenticated user
     * Step 1: Validate new password matches confirm password
     * Step 2: Verify current password against stored BCrypt hash
     * Step 3: Encode new password and save
     */
    public void changePassword(Employee employee, ChangePasswordRequest request) {
        
        // Step 1: Validate that new password and confirm password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadCredentialsException("New password and confirm password do not match");
        }
        
        // Step 2: Verify current password using BCrypt
        // User enters: "currentPassword"
        // Backend HASHES it and COMPARES with DB stored hash
        if (!passwordEncoder.matches(request.getCurrentPassword(), employee.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        
        // Step 3: Encode new password and save to database
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        employee.setPassword(encodedNewPassword);
        employeeRepository.save(employee);
    }
}