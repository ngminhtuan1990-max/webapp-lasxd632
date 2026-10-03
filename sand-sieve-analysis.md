# Task: Create SandSieveAnalysis Component (Thành phần hạt cát & Mô đun độ lớn)

## 1. Context & Role
- **Role:** Expert React developer and Data Visualization specialist.
- **Task:** Create a React component named `SandSieveAnalysis` for testing concrete fine aggregate (sand). It must calculate Sieve Analysis percentages, visualize the grading curve, and compute the Fineness Modulus (Mô đun độ lớn - FM / M_l) according to TCVN standards.

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- **Recharts** (CRITICAL: Must use for the grading curve `LineChart`).
- Lucide Icons & Shadcn UI (Card, Input, Table/Grid layout, Badge).

## 3. Standard Sieve Data
Use this exact array for the sieves (standard sizes in mm for Vietnamese concrete sand testing):
```json
[
  { id: '10.0', name: '10.0 mm', isFMSieve: false },
  { id: '5.0', name: '5.0 mm', isFMSieve: true },
  { id: '2.5', name: '2.5 mm', isFMSieve: true },
  { id: '1.25', name: '1.25 mm', isFMSieve: true },
  { id: '0.63', name: '0.63 mm', isFMSieve: true },
  { id: '0.315', name: '0.315 mm', isFMSieve: true },
  { id: '0.14', name: '0.14 mm', isFMSieve: true },
  { id: 'bottom', name: 'Đáy (Pan)', isFMSieve: false }
]