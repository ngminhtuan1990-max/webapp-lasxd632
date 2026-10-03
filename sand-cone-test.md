# Task: Create SandConeTest Component (Đo K bằng phễu rót cát)

## 1. Context & Role
- **Role:** Expert React developer focusing on Mobile-first UI/UX.
- **Task:** Create a new React component named `SandConeTest` for a Civil Engineering field-testing web application.

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- Lucide Icons (for UI elements)
- Shadcn UI (use if available, otherwise fallback to plain Tailwind components)

## 3. UI Structure & UX Requirements
- **Mobile-first Layout:** Inputs MUST be stacked vertically on mobile screens and use a grid layout on desktop screens.
- **Input Fields:** Use large, tap-friendly input fields with `type="number"`.
- **Real-time Auto-calculation:** DO NOT use a "Calculate" button. Results must be computed automatically in real-time as the user types (use React derived state or `useMemo`/`useEffect`).
- **Layout Split:** Divide the form into 2 distinct sections:
  1. **Section 1 - Thông số vật liệu chuẩn** (Standard constants - rarely change).
  2. **Section 2 - Số liệu đo tại hố** (Field measurements).
- **Sticky Result Card:** The final result (Hệ số K) must be highly visible at the bottom or top of the form. 
  - If `K >= kRequired` ➔ Text/Background color is **Green** (Pass).
  - If `K < kRequired` ➔ Text/Background color is **Red** (Fail).

## 4. Variables & Formulas (State Management)

### Inputs: Section 1 (Constants)
- `coneSandWeight` (Khối lượng cát trong phễu nón - g) | Default: 1550
- `sandDensity` (Dung trọng cát chuẩn - g/cm³) | Default: 1.45
- `maxDryDensity` (Dung trọng khô lớn nhất / Proctor - g/cm³) | Default: 2.15
- `kRequired` (Hệ số K yêu cầu) | Default: 0.95

### Inputs: Section 2 (Field Measurements)
- `w1` (Khối lượng phễu + cát ban đầu - g)
- `w2` (Khối lượng phễu + cát còn lại - g)
- `wWet` (Khối lượng đất ướt từ hố đào - g)
- `moisture` (Độ ẩm của đất - %)

### Calculations
*Critical: The code must handle `NaN`, `Infinity`, or Division by Zero gracefully when inputs are empty.*

1. `wHoleSand` (Khối lượng cát trong hố - g) = `w1 - w2 - coneSandWeight`
2. `volume` (Thể tích hố đào - cm³) = `wHoleSand / sandDensity`
3. `wetDensity` (Dung trọng ướt hố đào - g/cm³) = `wWet / volume`
4. `dryDensity` (Dung trọng khô hố đào - g/cm³) = `wetDensity / (1 + (moisture / 100))`
5. `K` (Hệ số đầm chặt) = `dryDensity / maxDryDensity` *(Round to 3 decimal places)*

## 5. Additional Output Details
- Display intermediate results (`volume`, `wetDensity`, `dryDensity`) below the inputs. Style them as muted/grayed out so they do not distract from the main result `K`.
- Include a "Xóa dữ liệu" (Clear) button that resets **ONLY Section 2** (Field Measurements), keeping Section 1 constants intact for the next test hole.
- Format all numeric displays to 2 or 3 decimal places consistently.
- Output the complete, self-contained, production-ready React component code.