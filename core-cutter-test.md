# Task: Create CoreCutterTest Component (Đo K bằng dao vòng)

## 1. Context & Role
- **Role:** Expert React developer focusing on Mobile-first UI/UX.
- **Task:** Create a new React component named `CoreCutterTest` for a Civil Engineering field-testing web application.

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- Lucide Icons (for UI elements)
- Shadcn UI (use if available, otherwise fallback to plain Tailwind components)

## 3. UI Structure & UX Requirements
- **Mobile-first Layout:** Inputs MUST be stacked vertically on mobile screens and use a grid layout on desktop screens.
- **Input Fields:** Use large, tap-friendly input fields with `type="number"`.
- **Real-time Auto-calculation:** DO NOT use a "Calculate" button. Results must be computed automatically in real-time as the user types (use React derived state or `useMemo`).
- **Layout Split:** Divide the form into 2 distinct sections:
  1. **Section 1 - Thông số tiêu chuẩn & Dao vòng** (Standard constants - rarely change per section).
  2. **Section 2 - Số liệu đo tại hiện trường** (Field measurements).
- **Sticky Result Card:** The final result (Hệ số K) must be highly visible at the top or bottom. 
  - If `K >= kRequired` ➔ Text/Background color is **Green** (Pass).
  - If `K < kRequired` ➔ Text/Background color is **Red** (Fail).

## 4. Variables & Formulas (State Management)

### Inputs: Section 1 (Constants)
- `ringVolume` (Thể tích dao vòng - cm³) | Default: 100
- `ringWeight` (Khối lượng dao vòng rỗng - g) | Default: 125
- `maxDryDensity` (Dung trọng khô lớn nhất / Proctor - g/cm³) | Default: 1.85
- `kRequired` (Hệ số K yêu cầu) | Default: 0.95

### Inputs: Section 2 (Field Measurements)
- `ringPlusWetSoilWeight` (Khối lượng dao vòng + đất ướt - g)
- `moisture` (Độ ẩm của đất - %)

### Calculations
*Critical: The code must handle `NaN`, `Infinity`, or Division by Zero gracefully when inputs are empty or invalid.*

1. `wetSoilWeight` (Khối lượng đất ướt - g) = `ringPlusWetSoilWeight - ringWeight`
2. `wetDensity` (Dung trọng ướt - g/cm³) = `wetSoilWeight / ringVolume`
3. `dryDensity` (Dung trọng khô - g/cm³) = `wetDensity / (1 + (moisture / 100))`
4. `K` (Hệ số đầm chặt) = `dryDensity / maxDryDensity` *(Round to 3 decimal places)*

## 5. Additional Output Details
- Display intermediate results (`wetSoilWeight`, `wetDensity`, `dryDensity`) elegantly below the inputs in Section 2. Style them as muted/grayed out so they do not distract from the main result `K`.
- Include a "Xóa dữ liệu hố đo" (Clear) button that resets **ONLY Section 2** (Field Measurements), keeping Section 1 constants intact for the next test.
- Format all numeric displays to 2 or 3 decimal places consistently.
- Output the complete, self-contained, production-ready React component code.