# Task: Create MortarStrengthTest Component (Uốn và Nén vữa - TCVN 3121-11:2022)

## 1. Context & Role
- **Role:** Expert React developer focusing on Mobile-first UI/UX for Civil Engineering.
- **Task:** Create a React component named `MortarStrengthTest` to calculate both flexural (uốn) and compressive (nén) strength of mortar specimens according to TCVN 3121-11:2022. 

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- Lucide Icons & Shadcn UI (Card, Input, Label, Badge, Alert, Tabs or Sections).

## 3. UI Structure & UX Requirements
- **Mobile-first Layout:** Vertical stacking for easy field data entry.
- **Auto-calculation:** Results compute in real-time.
- **Layout Split (Use Cards or Sections):**
  - **Section 1: Kích thước mẫu (Constants):** Width (b), Height (h), Span length (l).
  - **Section 2: Cường độ Uốn (Flexural):** 3 inputs for Failure Load `P_u` (N). Shows individual strengths and final average.
  - **Section 3: Cường độ Nén (Compressive):** 6 inputs for Failure Load `P_n` (N) (tested on the 6 broken halves from the flexural test). Shows individual strengths and final average.

## 4. Variables & State Management

### Inputs: Section 1 (Constants)
- `widthB` (Chiều rộng b - mm) | Default: 40
- `heightH` (Chiều cao h - mm) | Default: 40
- `spanL` (Khoảng cách gối uốn l - mm) | Default: 100
- `areaA` (Diện tích nén A - mm²) | Default: 1600 (typically 40x40)

### Inputs: Section 2 (Flexural Measurements)
- `pu1`, `pu2`, `pu3` (Lực uốn gãy - N)

### Inputs: Section 3 (Compressive Measurements)
- `pn1`, `pn2`, `pn3`, `pn4`, `pn5`, `pn6` (Lực nén phá hủy - N)

## 5. Calculations & Logic (TCVN 3121-11:2022)
*Helper function: `round0_05(val)` to round to nearest 0.05, and `round0_1(val)` to round to nearest 0.1.*

### Part A: Cường độ Uốn (Flexural Strength - R_u)
1. **Calculate individual strengths:** 
   For i in 1..3: `Ru_i = 1.5 * ((Pu_i * spanL) / (widthB * Math.pow(heightH, 2)))`
   *(Round `Ru_i` to nearest 0.05 MPa).*
2. **Calculate initial average:** `Ru_avg_initial = (Ru1 + Ru2 + Ru3) / 3`
3. **Variance Logic (10% Rule):**
   - Check deviation for each `Ru_i`: `dev_i = Math.abs(Ru_i - Ru_avg_initial) / Ru_avg_initial * 100` (%)
   - If any `dev_i > 10%`, discard that `Ru_i`.
   - `Ru_final` = Average of the remaining specimens.
   *(Round `Ru_final` to nearest 0.1 MPa).*
   - **UI Alert:** If a specimen is discarded, show a small warning: "Đã loại bỏ mẫu uốn vượt quá 10% sai số".

### Part B: Cường độ Nén (Compressive Strength - R_n)
1. **Calculate individual strengths:**
   For j in 1..6: `Rn_j = Pn_j / areaA`
   *(Round `Rn_j` to nearest 0.05 MPa).*
2. **Calculate initial average:** `Rn_avg_initial = sum(Rn_1...Rn_6) / 6`
3. **Variance Logic (15% Rule):**
   - Check deviation for each `Rn_j`: `dev_j = Math.abs(Rn_j - Rn_avg_initial) / Rn_avg_initial * 100` (%)
   - If `dev_j > 15%`, discard that `Rn_j`.
   - `validSamples` = list of `Rn_j` that were NOT discarded.
   - If `validSamples.length === 0` (all 6 discarded): `Rn_final = 0`, and set `isRetestRequired = true`.
   - Else: `Rn_final = sum(validSamples) / validSamples.length`.
   *(Round `Rn_final` to nearest 0.1 MPa).*
   - **UI Alert:** If any samples are discarded, show a warning listing the discarded ones. If `isRetestRequired === true`, show a CRITICAL RED ALERT: "Cả 6 mẫu đều sai lệch > 15%. Tiến hành thử lại trên mẫu lưu!".

## 6. Expected Output Details
- Display individual `Ru_i` and `Rn_j` in muted text next to their respective load input fields.
- Prominently display the final results `Ru_final` and `Rn_final` in distinct result cards.
- Handle empty inputs gracefully (don't show NaN). Only compute final averages when all required inputs in a section are filled.
- Include a "Xóa dữ liệu" button to clear measurements.
- Output the complete, self-contained React component code.