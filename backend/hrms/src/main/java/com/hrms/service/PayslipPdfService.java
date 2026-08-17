package com.hrms.service;

import com.hrms.entity.Payslip;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Service
public class PayslipPdfService {

    // ---------------------------------------------------------
    // COMPANY DETAILS
    // ---------------------------------------------------------

    private static final String COMPANY_NAME =
            "Paxsat Business Solutions Pvt Ltd";

    private static final String[] COMPANY_ADDRESS_LINES = {
            "#20-03-88/SivaJyothi Nagar, Near Leela Mahal",
            "Opp.Pillar No-65,TIRUPATI,",
            "CHITTOR, ANDHRA PRADESH,",
            "PHONE NO: +91 7981462933"
    };

    private static final String[] MONTHS = {
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
    };

    // ---------------------------------------------------------
    // PDF SETTINGS
    // ---------------------------------------------------------

    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
    private static final float MARGIN = 36f;

    private static final Color BLACK = Color.BLACK;
    private static final Color GRAY = new Color(90, 90, 90);

    private final PDType1Font FONT_BOLD =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

    private final PDType1Font FONT_REG =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA);

    // ---------------------------------------------------------
    // GENERATE PDF
    // ---------------------------------------------------------

    public byte[] generatePayslipPdf(Payslip p) {

        try (PDDocument doc = new PDDocument()) {

            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream cs =
                         new PDPageContentStream(doc, page)) {

                cs.setStrokingColor(BLACK);
                cs.setNonStrokingColor(BLACK);

                float pageLeft = MARGIN;
                float pageRight = PAGE_WIDTH - MARGIN;
                float y = PAGE_HEIGHT - MARGIN;

                // =====================================================
                // LETTERHEAD
                // =====================================================

                float logoSize = 60f;
                boolean hasLogo = false;

                try {

                    PDImageXObject logo =
                            PDImageXObject.createFromFile(
                                    new ClassPathResource(
                                            "static/logo.png"
                                    ).getFile().getAbsolutePath(),
                                    doc
                            );

                    cs.drawImage(
                            logo,
                            pageLeft,
                            y - logoSize,
                            logoSize,
                            logoSize
                    );

                    hasLogo = true;

                } catch (Exception ignored) {
                    // Logo is optional
                }

                float textX =
                        hasLogo
                                ? pageLeft + logoSize + 14
                                : pageLeft;

                float lineY = y - 12;

                drawText(
                        cs,
                        FONT_BOLD,
                        12,
                        BLACK,
                        textX,
                        lineY,
                        COMPANY_NAME
                );

                lineY -= 13;

                for (String line : COMPANY_ADDRESS_LINES) {

                    drawText(
                            cs,
                            FONT_REG,
                            9,
                            GRAY,
                            textX,
                            lineY,
                            line
                    );

                    lineY -= 12;
                }

                // =====================================================
                // TITLE
                // =====================================================

                int monthIndex = p.getMonth() - 1;

                if (monthIndex < 0 || monthIndex > 11) {
                    monthIndex = 0;
                }

                String title =
                        "Salary statement for "
                                + MONTHS[monthIndex]
                                + " "
                                + p.getYear();

                float titleWidth =
                        FONT_BOLD.getStringWidth(title)
                                / 1000f
                                * 14f;

                drawText(
                        cs,
                        FONT_BOLD,
                        14,
                        BLACK,
                        pageRight - titleWidth,
                        y - 12,
                        title
                );

                y -= logoSize + 20;

                // =====================================================
                // EMPLOYEE INFORMATION
                // =====================================================

                float infoBoxTop = y;

                float colGap =
                        (pageRight - pageLeft) / 2;

                float leftLabelX = pageLeft + 6;
                float leftValueX = pageLeft + 80;

                float rightLabelX =
                        pageLeft + colGap + 6;

                float rightValueX =
                        pageLeft + colGap + 90;

                float rowH = 18f;

                int infoRows = 5;

                String employeeName =
                        p.getEmployee() != null
                                ? p.getEmployee().getFirstName()
                                + " "
                                + p.getEmployee().getLastName()
                                : "-";

                String employeeCode =
                        p.getEmployee() != null
                                ? p.getEmployee().getEmployeeId()
                                : "-";

                String designation =
                        p.getEmployee() != null
                                ? p.getEmployee().getDesignation()
                                : "-";

                String department =
                        p.getEmployee() != null
                                ? nullSafe(
                                        p.getEmployee().getDepartment()
                                )
                                : "-";

                String phone =
                        p.getEmployee() != null
                                ? nullSafe(
                                        p.getEmployee().getPhone()
                                )
                                : "-";

                String email =
                        p.getEmployee() != null
                                ? nullSafe(
                                        p.getEmployee().getEmail()
                                )
                                : "-";

                String doj =
                        p.getEmployee() != null
                                && p.getEmployee().getDateOfJoining() != null
                                ? p.getEmployee()
                                .getDateOfJoining()
                                .toString()
                                : "-";

                String dob =
                        p.getEmployee() != null
                                && p.getEmployee().getDateOfBirth() != null
                                ? p.getEmployee()
                                .getDateOfBirth()
                                .toString()
                                : "-";

                String[][] leftRows = {

                        {
                                "NAME",
                                nullSafe(employeeName)
                        },

                        {
                                "DEPARTMENT",
                                department
                        },

                        {
                                "DESIGNATION",
                                nullSafe(designation)
                        },

                        {
                                "EMAIL",
                                email
                        },

                        {
                                "PHONE",
                                phone
                        }
                };

                String[][] rightRows = {

                        {
                                "EMPNO",
                                nullSafe(employeeCode)
                        },

                        {
                                "DOB",
                                dob
                        },

                        {
                                "DOJ",
                                doj
                        },

                        {
                                "",
                                ""
                        },

                        {
                                "",
                                ""
                        }
                };

                float rowY =
                        infoBoxTop - 13;

                for (int i = 0; i < infoRows; i++) {

                    drawText(
                            cs,
                            FONT_BOLD,
                            9,
                            BLACK,
                            leftLabelX,
                            rowY,
                            leftRows[i][0]
                    );

                    drawText(
                            cs,
                            FONT_REG,
                            9,
                            BLACK,
                            leftValueX,
                            rowY,
                            leftRows[i][1]
                    );

                    drawText(
                            cs,
                            FONT_BOLD,
                            9,
                            BLACK,
                            rightLabelX,
                            rowY,
                            rightRows[i][0]
                    );

                    drawText(
                            cs,
                            FONT_REG,
                            9,
                            BLACK,
                            rightValueX,
                            rowY,
                            rightRows[i][1]
                    );

                    rowY -= rowH;
                }

                float afterInfoY =
                        rowY + rowH - 18;

                float attendanceRowH = 24f;

                float infoBoxBottom =
                        afterInfoY - attendanceRowH;

                // =====================================================
                // ATTENDANCE
                // =====================================================

                int standardDays =
                        p.getMonth() > 0
                                ? java.time.YearMonth
                                .of(
                                        p.getYear(),
                                        p.getMonth()
                                )
                                .lengthOfMonth()
                                : 31;

                int presentDays =
                        p.getPresentDays();

                int lopDays =
                        p.getLopDays();

                float attTextY =
                        afterInfoY - 15;

                drawText(
                        cs,
                        FONT_REG,
                        9,
                        BLACK,
                        leftLabelX,
                        attTextY,
                        "Standard Days: "
                                + standardDays
                                + "    Payable Days: "
                                + presentDays
                                + "    Loss of Pay Days: "
                                + lopDays
                                + "    LOP Reversal Days: 0    Arrear Days: 0"
                );

                // =====================================================
                // EMPLOYEE BOX BORDER
                // =====================================================

                cs.setLineWidth(1f);

                cs.addRect(
                        pageLeft,
                        infoBoxBottom,
                        pageRight - pageLeft,
                        infoBoxTop - infoBoxBottom
                );

                cs.stroke();

                cs.moveTo(
                        pageLeft + colGap,
                        infoBoxTop
                );

                cs.lineTo(
                        pageLeft + colGap,
                        afterInfoY
                );

                cs.stroke();

                cs.moveTo(
                        pageLeft,
                        afterInfoY
                );

                cs.lineTo(
                        pageRight,
                        afterInfoY
                );

                cs.stroke();

                y =
                        infoBoxBottom - 18;

                // =====================================================
                // EARNINGS / DEDUCTIONS TABLE
                // =====================================================

                float tableTop = y;

                float tableLeft = pageLeft;
                float tableRight = pageRight;

                float midX =
                        tableLeft
                                + (tableRight - tableLeft)
                                * 0.55f;

                float earnLabelX =
                        tableLeft + 6;

                float earnCurX =
                        tableLeft + 200;

                float earnArrX =
                        tableLeft + 280;

                float earnTotX =
                        midX - 55;

                float dedLabelX =
                        midX + 6;

                float dedTotX =
                        tableRight - 55;

                float headerH = 20f;

                float headerTextY =
                        tableTop - 14;

                drawText(
                        cs,
                        FONT_BOLD,
                        9,
                        BLACK,
                        earnLabelX,
                        headerTextY,
                        "EARNINGS"
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        7.5f,
                        BLACK,
                        earnCurX,
                        headerTextY,
                        "CURRENT MONTH"
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        8,
                        BLACK,
                        earnArrX,
                        headerTextY,
                        "ARREAR"
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        9,
                        BLACK,
                        earnTotX,
                        headerTextY,
                        "TOTAL"
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        9,
                        BLACK,
                        dedLabelX,
                        headerTextY,
                        "DEDUCTIONS"
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        9,
                        BLACK,
                        dedTotX,
                        headerTextY,
                        "TOTAL"
                );

                float headerBottomY =
                        tableTop - headerH;

                // =====================================================
                // EARNINGS
                // =====================================================

                String[][] earnings = {

                        {
                                "BASIC",
                                fmt(p.getBasicSalary())
                        },

                        {
                                "HRA",
                                fmt(p.getHra())
                        },

                        {
                                "DA",
                                fmt(p.getDa())
                        },

                        {
                                "SPECIAL ALLOWANCE",
                                fmt(p.getSpecialAllowance())
                        }
                };

                // =====================================================
                // IMPORTANT:
                // USE STORED PAYSLIP VALUES.
                //
                // DO NOT RECALCULATE PF.
                // DO NOT RECALCULATE PROFESSIONAL TAX.
                // DO NOT RECALCULATE TOTAL DEDUCTIONS.
                // DO NOT RECALCULATE NET SALARY.
                // =====================================================

                BigDecimal esiAmt =
                        p.getEsi() == null
                                ? BigDecimal.ZERO
                                : p.getEsi();

                BigDecimal tdsAmt =
                        p.getTds() == null
                                ? BigDecimal.ZERO
                                : p.getTds();

                BigDecimal pfAmt =
                        p.getPf() == null
                                ? BigDecimal.ZERO
                                : p.getPf();

                BigDecimal professionalTaxAmt =
                        p.getProfessionalTax() == null
                                ? BigDecimal.ZERO
                                : p.getProfessionalTax();

                BigDecimal totalDeductions =
                        p.getTotalDeductions() == null
                                ? BigDecimal.ZERO
                                : p.getTotalDeductions();

                BigDecimal grossAmt =
                        p.getGrossSalary() == null
                                ? BigDecimal.ZERO
                                : p.getGrossSalary();

                BigDecimal netPay =
                        p.getNetSalary() == null
                                ? BigDecimal.ZERO
                                : p.getNetSalary();

                // =====================================================
                // DEDUCTIONS
                // =====================================================

                String[][] deductions = {

                        {
                                "ESI",
                                fmt(esiAmt)
                        },

                        {
                                "TDS",
                                fmt(tdsAmt)
                        },

                        {
                                "PF",
                                fmt(pfAmt)
                        },

                        {
                                "PROFESSIONAL TAX",
                                fmt(professionalTaxAmt)
                        }
                };

                // =====================================================
                // TABLE ROWS
                // =====================================================

                int maxRows =
                        Math.max(
                                earnings.length,
                                deductions.length
                        );

                float lineH = 26f;

                float rowsTop =
                        headerBottomY;

                for (int i = 0; i < maxRows; i++) {

                    float ry =
                            rowsTop
                                    - 16
                                    - i * lineH;

                    // -----------------------------
                    // Earnings
                    // -----------------------------

                    if (i < earnings.length) {

                        drawText(
                                cs,
                                FONT_REG,
                                9,
                                BLACK,
                                earnLabelX,
                                ry,
                                earnings[i][0]
                        );

                        drawText(
                                cs,
                                FONT_REG,
                                9,
                                BLACK,
                                earnCurX,
                                ry,
                                earnings[i][1]
                        );

                        drawText(
                                cs,
                                FONT_REG,
                                9,
                                BLACK,
                                earnTotX,
                                ry,
                                earnings[i][1]
                        );
                    }

                    // -----------------------------
                    // Deductions
                    // -----------------------------

                    if (i < deductions.length) {

                        drawText(
                                cs,
                                FONT_REG,
                                8,
                                BLACK,
                                dedLabelX,
                                ry,
                                deductions[i][0]
                        );

                        drawText(
                                cs,
                                FONT_REG,
                                9,
                                BLACK,
                                dedTotX,
                                ry,
                                deductions[i][1]
                        );
                    }
                }

                float rowsBottomY =
                        rowsTop
                                - maxRows * lineH;

                // =====================================================
                // SUMMARY
                // =====================================================

                float summaryH = 22f;

                float summaryTextY =
                        rowsBottomY - 15;

                drawText(
                        cs,
                        FONT_BOLD,
                        10,
                        BLACK,
                        earnLabelX,
                        summaryTextY,
                        "GROSS EARNINGS"
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        10,
                        BLACK,
                        earnTotX,
                        summaryTextY,
                        fmt(grossAmt)
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        10,
                        BLACK,
                        dedLabelX,
                        summaryTextY,
                        "TOTAL DEDUCTIONS"
                );

                drawText(
                        cs,
                        FONT_BOLD,
                        10,
                        BLACK,
                        dedTotX,
                        summaryTextY,
                        fmt(totalDeductions)
                );

                float summaryBottomY =
                        rowsBottomY - summaryH;

                // =====================================================
                // NET PAY
                // =====================================================

                float netH = 40f;

                float netBottomY =
                        summaryBottomY - netH;

                float netTextY =
                        summaryBottomY - 18;

                drawText(
                        cs,
                        FONT_BOLD,
                        12,
                        BLACK,
                        earnLabelX,
                        netTextY,
                        "NET PAY"
                );

                String netStr =
                        fmt(netPay);

                float netStrWidth =
                        FONT_BOLD.getStringWidth(netStr)
                                / 1000f
                                * 13f;

                drawText(
                        cs,
                        FONT_BOLD,
                        13,
                        BLACK,
                        tableRight - 10 - netStrWidth,
                        netTextY,
                        netStr
                );

                // =====================================================
                // NET PAY IN WORDS
                // =====================================================

                String words =
                        numberToWords(
                                netPay.longValue()
                        );

                drawText(
                        cs,
                        FONT_REG,
                        8,
                        GRAY,
                        earnLabelX,
                        netTextY - 14,
                        "(RUPEES "
                                + words
                                + " ONLY)"
                );

                // =====================================================
                // TABLE BORDERS
                // =====================================================

                cs.setLineWidth(1f);

                // Outer rectangle
                cs.addRect(
                        tableLeft,
                        netBottomY,
                        tableRight - tableLeft,
                        tableTop - netBottomY
                );

                cs.stroke();

                // Vertical divider
                cs.moveTo(
                        midX,
                        tableTop
                );

                cs.lineTo(
                        midX,
                        summaryBottomY
                );

                cs.stroke();

                // Header line
                cs.moveTo(
                        tableLeft,
                        headerBottomY
                );

                cs.lineTo(
                        tableRight,
                        headerBottomY
                );

                cs.stroke();

                // Rows bottom line
                cs.moveTo(
                        tableLeft,
                        rowsBottomY
                );

                cs.lineTo(
                        tableRight,
                        rowsBottomY
                );

                cs.stroke();

                // Summary bottom line
                cs.moveTo(
                        tableLeft,
                        summaryBottomY
                );

                cs.lineTo(
                        tableRight,
                        summaryBottomY
                );

                cs.stroke();
            }

            // =====================================================
            // SAVE PDF
            // =====================================================

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            doc.save(out);

            return out.toByteArray();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate payslip PDF",
                    e
            );
        }
    }

    // =============================================================
    // DRAW TEXT
    // =============================================================

    private void drawText(
            PDPageContentStream cs,
            PDType1Font font,
            float size,
            Color color,
            float x,
            float y,
            String text
    ) throws IOException {

        cs.beginText();

        cs.setFont(
                font,
                size
        );

        cs.setNonStrokingColor(
                color
        );

        cs.newLineAtOffset(
                x,
                y
        );

        cs.showText(
                text == null
                        ? ""
                        : text
        );

        cs.endText();
    }

    // =============================================================
    // NULL SAFE
    // =============================================================

    private String nullSafe(String s) {

        return (
                s == null
                        || s.isBlank()
        )
                ? "-"
                : s;
    }

    // =============================================================
    // FORMAT AMOUNT
    // =============================================================

    private String fmt(BigDecimal amount) {

        if (amount == null) {
            return "0";
        }

        NumberFormat nf =
                NumberFormat.getInstance(
                        new Locale("en", "IN")
                );

        nf.setMaximumFractionDigits(0);

        return nf.format(amount);
    }

    // =============================================================
    // NUMBER TO WORDS
    // =============================================================

    private String numberToWords(long number) {

        if (number == 0) {
            return "ZERO";
        }

        String[] ones = {
                "",
                "ONE",
                "TWO",
                "THREE",
                "FOUR",
                "FIVE",
                "SIX",
                "SEVEN",
                "EIGHT",
                "NINE",
                "TEN",
                "ELEVEN",
                "TWELVE",
                "THIRTEEN",
                "FOURTEEN",
                "FIFTEEN",
                "SIXTEEN",
                "SEVENTEEN",
                "EIGHTEEN",
                "NINETEEN"
        };

        String[] tens = {
                "",
                "",
                "TWENTY",
                "THIRTY",
                "FORTY",
                "FIFTY",
                "SIXTY",
                "SEVENTY",
                "EIGHTY",
                "NINETY"
        };

        StringBuilder sb =
                new StringBuilder();

        long crore =
                number / 10000000;

        number %= 10000000;

        long lakh =
                number / 100000;

        number %= 100000;

        long thousand =
                number / 1000;

        number %= 1000;

        long hundred =
                number / 100;

        number %= 100;

        if (crore > 0) {

            sb.append(
                    twoDigit(
                            crore,
                            ones,
                            tens
                    )
            ).append(" CRORE ");
        }

        if (lakh > 0) {

            sb.append(
                    twoDigit(
                            lakh,
                            ones,
                            tens
                    )
            ).append(" LAKH ");
        }

        if (thousand > 0) {

            sb.append(
                    twoDigit(
                            thousand,
                            ones,
                            tens
                    )
            ).append(" THOUSAND ");
        }

        if (hundred > 0) {

            sb.append(
                    ones[(int) hundred]
            ).append(" HUNDRED ");
        }

        if (number > 0) {

            if (sb.length() > 0) {
                sb.append("AND ");
            }

            sb.append(
                    twoDigit(
                            number,
                            ones,
                            tens
                    )
            );
        }

        return sb.toString().trim();
    }

    // =============================================================
    // TWO DIGIT NUMBER
    // =============================================================

    private String twoDigit(
            long n,
            String[] ones,
            String[] tens
    ) {

        if (n < 20) {
            return ones[(int) n];
        }

        return (
                tens[(int) (n / 10)]
                        + " "
                        + ones[(int) (n % 10)]
        ).trim();
    }
}