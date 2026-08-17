package com.hrms.service;

import com.hrms.dto.PayslipDTOs;
import com.hrms.entity.Employee;
import com.hrms.entity.Payroll;
import com.hrms.entity.Payslip;
import com.hrms.repository.PayrollRepository;
import com.hrms.repository.PayslipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PayslipService {

    private final PayslipRepository payslipRepo;
    private final PayrollRepository payrollRepo;
    private final EmployeeService employeeService;

    @Transactional
    public PayslipDTOs.Response generatePayslip(Long payrollId) {

        // 1. Get the payroll
        Payroll payroll = payrollRepo.findById(payrollId)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Payroll not found: " + payrollId
                        ));

        // 2. Create payslip number
        String payslipNumber = String.format(
                "PS-%d-%02d-%s",
                payroll.getYear(),
                payroll.getMonth(),
                payroll.getEmployee().getEmployeeId()
        );

        // 3. Check whether payslip already exists
        //    If it exists -> update it
        //    If it does not exist -> create it
        Payslip payslip = payslipRepo.findByPayroll_Id(payrollId)
                .orElseGet(() -> Payslip.builder()
                        .payroll(payroll)
                        .employee(payroll.getEmployee())
                        .month(payroll.getMonth())
                        .year(payroll.getYear())
                        .payslipNumber(payslipNumber)
                        .build());

        // 4. Update payslip with LATEST payroll information

        payslip.setPayroll(payroll);

        payslip.setEmployee(payroll.getEmployee());

        payslip.setMonth(payroll.getMonth());

        payslip.setYear(payroll.getYear());

        payslip.setBasicSalary(payroll.getBasicSalary());

        payslip.setHra(payroll.getHra());

        payslip.setDa(payroll.getDa());

        payslip.setSpecialAllowance(
                payroll.getSpecialAllowance()
        );

        payslip.setGrossSalary(
                payroll.getGrossSalary()
        );

        payslip.setEsi(
                payroll.getEsi()
        );

        payslip.setTds(
                payroll.getTds()
        );

        payslip.setPf(
                payroll.getPf()
        );

        payslip.setProfessionalTax(
                payroll.getProfessionalTax()
        );

        payslip.setTotalDeductions(
                payroll.getTotalDeductions()
        );

        payslip.setNetSalary(
                payroll.getNetSalary()
        );

        payslip.setPresentDays(
                payroll.getPresentDays()
        );

        payslip.setLopDays(
                payroll.getLopDays()
        );

        payslip.setPayDate(
                payroll.getPayDate()
        );

        // 5. Save the updated/new payslip
        Payslip savedPayslip = payslipRepo.save(payslip);

        // 6. Return response
        return toResponse(savedPayslip);
    }

    @Transactional(readOnly = true)
    public Page<PayslipDTOs.Response> getMyPayslips(
            Long employeeId,
            Pageable pageable) {

        Employee emp = employeeService.findById(employeeId);

        return payslipRepo
                .findByEmployee(emp, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PayslipDTOs.Response getByPayslipNumber(
            String payslipNumber,
            Employee emp) {

        Payslip payslip =
                getEntityByPayslipNumber(payslipNumber, emp);

        return toResponse(payslip);
    }

    @Transactional(readOnly = true)
    public Payslip getEntityByPayslipNumber(
            String payslipNumber,
            Employee emp) {

        Payslip payslip =
                payslipRepo.findByPayslipNumber(payslipNumber)
                        .orElseThrow(() ->
                                new NoSuchElementException(
                                        "Payslip not found: "
                                                + payslipNumber
                                ));

        // Employee can only access their own payslip
        if (emp.getRole() == com.hrms.enums.Role.EMPLOYEE
                && !payslip.getEmployee().getId()
                        .equals(emp.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not authorized to view this payslip."
            );
        }

        return payslip;
    }

    private PayslipDTOs.Response toResponse(Payslip p) {

        PayslipDTOs.Response r =
                new PayslipDTOs.Response();

        r.setId(p.getId());

        r.setPayslipNumber(
                p.getPayslipNumber()
        );

        r.setEmployeeDbId(
                p.getEmployee().getId()
        );

        r.setEmployeeName(
                p.getEmployee().getFirstName()
                        + " "
                        + p.getEmployee().getLastName()
        );

        r.setEmployeeCode(
                p.getEmployee().getEmployeeId()
        );

        r.setDepartment(
                p.getEmployee().getDepartment()
        );

        r.setDesignation(
                p.getEmployee().getDesignation()
        );

        r.setMonth(
                p.getMonth()
        );

        r.setYear(
                p.getYear()
        );

        r.setBasicSalary(
                p.getBasicSalary()
        );

        r.setHra(
                p.getHra()
        );

        r.setDa(
                p.getDa()
        );

        r.setSpecialAllowance(
                p.getSpecialAllowance()
        );

        r.setGrossSalary(
                p.getGrossSalary()
        );

        r.setEsi(
                p.getEsi()
        );

        r.setTds(
                p.getTds()
        );

        r.setPf(
                p.getPf()
        );

        r.setProfessionalTax(
                p.getProfessionalTax()
        );

        r.setTotalDeductions(
                p.getTotalDeductions()
        );

        r.setNetSalary(
                p.getNetSalary()
        );

        r.setPresentDays(
                p.getPresentDays()
        );

        r.setLopDays(
                p.getLopDays()
        );

        r.setPaid(
                p.getPayroll() != null
                        && p.getPayroll().isPaid()
        );

        r.setPayDate(
                p.getPayroll() != null
                        ? p.getPayroll().getPayDate()
                        : p.getPayDate()
        );

        r.setGeneratedAt(
                p.getGeneratedAt()
        );

        return r;
    }
}