package com.hrms.repository;

import com.hrms.entity.Employee;
import com.hrms.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    /**
     * Finds a single leave balance record for a specific employee, leave type, and
     * year.
     */
    Optional<LeaveBalance> findByEmployeeAndLeaveTypeAndYear(Employee employee, String leaveType, int year);

    /**
     * Finds all leave balance records across all employees for a given leave type
     * and year.
     * Required by resyncQuotasForCurrentYear() in LeaveBalanceService.
     */
    List<LeaveBalance> findByLeaveTypeAndYear(String leaveType, int year);
}