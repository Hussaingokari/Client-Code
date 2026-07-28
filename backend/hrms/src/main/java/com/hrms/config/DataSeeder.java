package com.hrms.config;

import com.hrms.entity.Employee;
import com.hrms.enums.Role;
import com.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.hrms.repository.EmailTemplateRepository emailTemplateRepository;

    @Value("${seed.admin.email:admin@hrms.com}")
    private String adminEmail;

    @Value("${seed.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${seed.hr.email:hr@hrms.com}")
    private String hrEmail;

    @Value("${seed.hr.password:Hr@12345}")
    private String hrPassword;

    @Value("${seed.employee.email:emp@hrms.com}")
    private String empEmail;

    @Value("${seed.employee.password:Emp@12345}")
    private String empPassword;

    @Override
    public void run(String... args) {

        // Seed default Admin
        if (!employeeRepository.existsByEmail(adminEmail)) {
            Employee admin = Employee.builder()
                    .employeeId("EMP0001")
                    .firstName("System")
                    .lastName("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .department("Administration")
                    .designation("System Administrator")
                    .role(Role.ADMIN)
                    .dateOfJoining(LocalDate.now())
                    .active(true)
                    .build();
            employeeRepository.save(admin);
            log.info("✅ ADMIN account seeded for email: {}  →  loginType: ADMIN", adminEmail);
        }

        // Seed default HR
        if (!employeeRepository.existsByEmail(hrEmail)) {
            Employee hr = Employee.builder()
                    .employeeId("EMP0002")
                    .firstName("HR")
                    .lastName("Manager")
                    .email(hrEmail)
                    .password(passwordEncoder.encode(hrPassword))
                    .department("Human Resources")
                    .designation("HR Manager")
                    .role(Role.HR)
                    .dateOfJoining(LocalDate.now())
                    .active(true)
                    .build();
            employeeRepository.save(hr);
            log.info("✅ HR account seeded for email: {}  →  loginType: HR", hrEmail);
        }

        // Seed default Employee
        if (!employeeRepository.existsByEmail(empEmail)) {
            Employee emp = Employee.builder()
                    .employeeId("EMP0003")
                    .firstName("Test")
                    .lastName("Employee")
                    .email(empEmail)
                    .password(passwordEncoder.encode(empPassword))
                    .department("Engineering")
                    .designation("Software Developer")
                    .role(Role.EMPLOYEE)
                    .dateOfJoining(LocalDate.now())
                    .active(true)
                    .build();
            employeeRepository.save(emp);
            log.info("✅ EMPLOYEE account seeded for email: {}  →  loginType: EMPLOYEE", empEmail);
        }

        seedEmailTemplates();
    }

    private void seedEmailTemplates() {
        if (emailTemplateRepository.count() == 0) {
            log.info("Seeding initial email templates...");

            com.hrms.entity.EmailTemplate welcomeGreeting = new com.hrms.entity.EmailTemplate();
            welcomeGreeting.setTemplateName("Welcome Greeting");
            welcomeGreeting.setTemplateSubject("Welcome to SAITEJA INFOTECH!");
            welcomeGreeting.setTemplateBody("Dear {CANDIDATE_NAME},\n\nWelcome to SAITEJA INFOTECH! We are excited to connect with you.\n\nBest regards,\nHR Team");
            welcomeGreeting.setIsActive(true);
            welcomeGreeting.setCreatedAt(java.time.LocalDateTime.now());
            welcomeGreeting.setUpdatedAt(java.time.LocalDateTime.now());

            com.hrms.entity.EmailTemplate offerLetter = new com.hrms.entity.EmailTemplate();
            offerLetter.setTemplateName("Offer Letter");
            offerLetter.setTemplateSubject("Offer of Employment from SAITEJA INFOTECH");
            offerLetter.setTemplateBody("Dear {CANDIDATE_NAME},\n\nWe are pleased to offer you the position of {JOB_TITLE} at SAITEJA INFOTECH. Your starting salary will be {SALARY}, and your expected joining date is {JOINING_DATE}. You will be reporting to {REPORTING_TO}.\n\nPlease review and let us know your decision by {ACCEPTANCE_DEADLINE}.\n\nCongratulations and we look forward to working with you!\n\nBest regards,\nHR Team");
            offerLetter.setIsActive(true);
            offerLetter.setCreatedAt(java.time.LocalDateTime.now());
            offerLetter.setUpdatedAt(java.time.LocalDateTime.now());

            com.hrms.entity.EmailTemplate onlineInterview = new com.hrms.entity.EmailTemplate();
            onlineInterview.setTemplateName("Online Interview Invitation");
            onlineInterview.setTemplateSubject("Invitation for Online Interview - SAITEJA INFOTECH");
            onlineInterview.setTemplateBody("Dear {CANDIDATE_NAME},\n\nThank you for applying to SAITEJA INFOTECH. We would like to invite you for an online interview for the {JOB_TITLE} position.\n\nDate: {INTERVIEW_DATE}\nTime: {INTERVIEW_TIME}\nPlatform: {PLATFORM}\nMeeting Link: {MEETING_LINK}\nMeeting ID: {MEETING_ID}\nPasscode: {PASSCODE}\n\nWe look forward to speaking with you.\n\nBest regards,\nHR Team");
            onlineInterview.setIsActive(true);
            onlineInterview.setCreatedAt(java.time.LocalDateTime.now());
            onlineInterview.setUpdatedAt(java.time.LocalDateTime.now());

            com.hrms.entity.EmailTemplate offlineInterview = new com.hrms.entity.EmailTemplate();
            offlineInterview.setTemplateName("Offline Interview Invitation");
            offlineInterview.setTemplateSubject("Invitation for In-Person Interview - SAITEJA INFOTECH");
            offlineInterview.setTemplateBody("Dear {CANDIDATE_NAME},\n\nThank you for applying to SAITEJA INFOTECH. We would like to invite you for an in-person interview for the {JOB_TITLE} position.\n\nDate: {INTERVIEW_DATE}\nTime: {INTERVIEW_TIME}\nVenue: {VENUE_ADDRESS}\n\nWe look forward to meeting you.\n\nBest regards,\nHR Team");
            offlineInterview.setIsActive(true);
            offlineInterview.setCreatedAt(java.time.LocalDateTime.now());
            offlineInterview.setUpdatedAt(java.time.LocalDateTime.now());

            java.util.List<com.hrms.entity.EmailTemplate> templates = java.util.Arrays.asList(welcomeGreeting, offerLetter, onlineInterview, offlineInterview);
            emailTemplateRepository.saveAll(templates);
            log.info("✅ Email templates seeded successfully.");
        }
    }
}
