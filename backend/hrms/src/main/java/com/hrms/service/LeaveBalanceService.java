package com.hrms.service;

import com.hrms.dto.LeaveDTOs;
import com.hrms.entity.Employee;
import com.hrms.entity.LeaveBalance;
import com.hrms.repository.LeaveBalanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LeaveBalanceService {

    private final LeaveBalanceRepository balanceRepo;

    // Company leave policy
    private static final Map<String, Double> DEFAULT_QUOTA = Map.of(
            "ANNUAL", 18.0,
            "SICK", 12.0,
            "CASUAL", 6.0,
            "MATERNITY", 180.0, // 6 months
            "PATERNITY", 5.0,
            "EARNED", 18.0);

    // Every leave type an employee should see a balance card for, in display order
    private static final List<String> ALL_LEAVE_TYPES = List.of(
            "ANNUAL", "SICK", "CASUAL", "PATERNITY", "MATERNITY", "EARNED");

    @Transactional
    public LeaveBalance getOrCreateBalance(Employee employee, String leaveType) {
        int year = Year.now().getValue();
        return balanceRepo.findByEmployeeAndLeaveTypeAndYear(employee, leaveType, year)
                .orElseGet(() -> {
                    double quota = DEFAULT_QUOTA.getOrDefault(leaveType, 12.0);
                    LeaveBalance lb = LeaveBalance.builder()
                            .employee(employee)
                            .leaveType(leaveType)
                            .year(year)
                            .totalAllotted(quota)
                            .used(0)
                            .remaining(quota)
                            .build();
                    return balanceRepo.save(lb);
                });
    }

    public boolean hasSufficientBalance(Employee employee, String leaveType, int requestedDays) {
        LeaveBalance balance = getOrCreateBalance(employee, leaveType);
        return balance.getRemaining() >= requestedDays;
    }

    @Transactional
    public void deductBalance(Employee employee, String leaveType, int days) {
        LeaveBalance balance = getOrCreateBalance(employee, leaveType);
        balance.setUsed(balance.getUsed() + days);
        balanceRepo.save(balance); // remaining auto-recalculated via @PreUpdate
    }

    @Transactional
    public void restoreBalance(Employee employee, String leaveType, int days) {
        LeaveBalance balance = getOrCreateBalance(employee, leaveType);
        balance.setUsed(Math.max(0, balance.getUsed() - days));
        balanceRepo.save(balance);
    }

    @Transactional
    public List<LeaveDTOs.BalanceResponse> getAllBalances(Employee employee) {
        return ALL_LEAVE_TYPES.stream()
                .map(type -> getOrCreateBalance(employee, type))
                .map(this::toResponse)
                .toList();
    }

    /**
     * One-time fix for balances created BEFORE this policy change (e.g. Casual
     * was 7, Paternity was 15). Re-applies DEFAULT_QUOTA to every existing
     * balance row for the current year, keeping each employee's "used" days
     * intact and recomputing "remaining" from the new total.
     *
     * Call this once (e.g. from a temporary @PostConstruct, a one-off admin
     * endpoint, or a CommandLineRunner) after deploying this change, then
     * remove the call. It does NOT touch UNPAID rows — see the note below on
     * deleting those separately.
     */
    @Transactional
    public void resyncQuotasForCurrentYear() {
        int year = Year.now().getValue();
        DEFAULT_QUOTA.forEach((type, quota) -> {
            List<LeaveBalance> rows = balanceRepo.findByLeaveTypeAndYear(type, year);
            for (LeaveBalance lb : rows) {
                lb.setTotalAllotted(quota);
                // remaining is recalculated via @PreUpdate based on totalAllotted - used
                balanceRepo.save(lb);
            }
        });
    }

    private LeaveDTOs.BalanceResponse toResponse(LeaveBalance lb) {
        LeaveDTOs.BalanceResponse r = new LeaveDTOs.BalanceResponse();
        r.setLeaveType(lb.getLeaveType());
        r.setYear(lb.getYear());
        r.setTotalAllotted(lb.getTotalAllotted());
        r.setUsed(lb.getUsed());
        r.setRemaining(lb.getRemaining());
        return r;
    }
}