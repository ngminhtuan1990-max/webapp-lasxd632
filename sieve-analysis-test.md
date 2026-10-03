# Task: Create SieveAnalysisTest Component (Phân tích thành phần hạt CPĐD)

## 1. Context & Role
- **Role:** Expert React developer and Data Visualization specialist.
- **Task:** Create a React component named `SieveAnalysisTest` for a Civil Engineering app. This component calculates the particle size distribution (Sieve Analysis) for Crushed Stone Base (Cấp phối đá dăm) and visualizes it.

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- **Recharts** (CRITICAL: Must use `recharts` library for the grading curve chart: `LineChart`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `Line`).
- Lucide Icons & Shadcn UI (if available).

## 3. Standard Data (Tiêu chuẩn cấp phối)
We are using a standard sieve set with Lower and Upper limits for "% Passing" (Lượng lọt sàng).
Please use this exact array as the standard configuration:
```json
[
  { id: '37.5', name: '37.5 mm', lower: 100, upper: 100 },
  { id: '25.0', name: '25.0 mm', lower: 79, upper: 90 },
  { id: '19.0', name: '19.0 mm', lower: 61, upper: 76 },
  { id: '9.5', name: '9.5 mm', lower: 40, upper: 58 },
  { id: '4.75', name: '4.75 mm', lower: 27, upper: 43 },
  { id: '2.36', name: '2.36 mm', lower: 18, upper: 33 },
  { id: '0.425', name: '0.425 mm', lower: 8, upper: 20 },
  { id: '0.075', name: '0.075 mm', lower: 2, upper: 8 },
  { id: 'bottom', name: 'Đáy (Pan)', lower: 0, upper: 0 }
]