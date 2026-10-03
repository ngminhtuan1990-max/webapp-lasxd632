# Task: Create ConcreteCompressiveTest Component (Nén mẫu bê tông TCVN & ASTM)

## 1. Context & Role
- **Role:** Expert React developer focusing on Mobile-first UI/UX for Civil Engineering.
- **Task:** Create a React component named `ConcreteCompressiveTest` to calculate concrete compressive strength. It must support BOTH Vietnamese standard (TCVN 3118:2022) and American standard (ASTM C39) logic within the same UI.

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- Lucide Icons & Shadcn UI (Card, Input, Label, Select, Badge, Alert, Tabs).

## 3. UI Structure & UX Requirements
- **Mobile-first Layout:** Vertical stacking.
- **Auto-calculation:** Results compute in real-time.
- **Layout Split:**
  - **Section 1: Tiêu chuẩn & Thông số (Constants):** 
    - Standard Selection Dropdown (TCVN 3118:2022 or ASTM C39).
    - Specimen Size Dropdown (options depend on the selected standard).
    - Required Strength / Mác (MPa).
  - **Section 2: Lực phá hoại (Measurements):** Inputs for failure load `P` (kN) for 3 specimens.
  - **Section 3: Kết quả (Results):** Display individual strengths, the Final Computed Strength, and a Pass/Fail evaluation badge.

## 4. Variables & State Management

### Inputs: Section 1 (Constants)
- `standard`: 'TCVN' | 'ASTM' (Default: 'TCVN')
- `requiredStrength` (Cường độ yêu cầu - MPa) | Default: 25
- `specimenType`: 
  - IF `standard === 'TCVN'`, options are:
    - `cube150`: Lập phương 150x150x150 (Chuẩn - Hệ số 1.00)
    - `cube100`: Lập phương 100x100x100 (Hệ số 0.91)
    - `cube200`: Lập phương 200x200x200 (Hệ số 1.05)
  - IF `standard === 'ASTM'`, options are:
    - `cyl150`: Trụ 150x300 mm
    - `cyl100`: Trụ 100x200 mm

### Inputs: Section 2 (Measurements)
- `p1`, `p2`, `p3` (Lực phá hoại viên 1, 2, 3 - kN)

## 5. Calculations & Logic
*Crucial: Handle empty inputs and recalculate immediately when `standard` changes.*

**Step 1: Calculate Specimen Area (mm²)**
- For `cube150`: `Area = 150 * 150`
- For `cube100`: `Area = 100 * 100`
- For `cube200`: `Area = 200 * 200`
- For `cyl150`: `Area = (Math.PI * Math.pow(150, 2)) / 4`
- For `cyl100`: `Area = (Math.PI * Math.pow(100, 2)) / 4`

**Step 2: Calculate Individual Strengths (MPa)**
For `i` from 1 to 3:
- `rawStrength_i = (p_i * 1000) / Area` *(1000 converts kN to N)*
- If `standard === 'TCVN'`:
  - `conversionFactor` = 1.00 (cube150), 0.91 (cube100), 1.05 (cube200).
  - `R_i = rawStrength_i * conversionFactor`
- If `standard === 'ASTM'`:
  - `R_i = rawStrength_i` *(Standard L/D = 2.0, so no correction factor needed).*
*(Round `R_i` to 1 decimal place).*

**Step 3: Calculate Final Strength (`R_final`) based on Standard**
- **IF `standard === 'TCVN'` (Apply 15% Variance Rule):**
  1. Sort `[R1, R2, R3]` to `R_min, R_mid, R_max`.
  2. `devMax = ((R_max - R_mid) / R_mid) * 100` (%)
  3. `devMin = ((R_mid - R_min) / R_mid) * 100` (%)
  4. If `devMax > 15` OR `devMin > 15`: 
     `R_final = R_mid`. (Set a boolean `isTcvnWarning = true`).
  5. Else: `R_final = (R1 + R2 + R3) / 3`.
  
- **IF `standard === 'ASTM'` (Simple Average):**
  - `R_final = (R1 + R2 + R3) / 3`. (Set `isTcvnWarning = false`).

**Step 4: Pass/Fail Evaluation**
- `isPass = R_final >= requiredStrength`

## 6. Expected Output Details
- **Dynamic UI:** When the user switches between TCVN and ASTM, the `specimenType` dropdown MUST update its options accordingly.
- In Section 2, display `R_i` (MPa) slightly grayed out next to each input field.
- **Alert/Info Box (TCVN ONLY):** If `isTcvnWarning === true`, display a visible yellow/orange alert: "Sai lệch > 15% so với trung vị. Theo TCVN 3118, loại bỏ 2 giá trị cực đại/cực tiểu, kết quả dùng giá trị trung vị."
- Include a "Xóa dữ liệu" button.
- Output the complete, self-contained React component code.