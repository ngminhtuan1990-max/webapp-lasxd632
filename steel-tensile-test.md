# Task: Create SteelTensileTest Component (Kéo thép & Tính dung sai khối lượng)

## 1. Context & Role
- **Role:** Expert React developer focusing on Mobile-first UI/UX for Civil Engineering.
- **Task:** Create a React component named `SteelTensileTest` to calculate both the Tensile Strength properties (Giới hạn chảy, Giới hạn bền, Độ giãn dài) and the Mass Tolerance (Dung sai khối lượng kg/m) for steel reinforcement bars.

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- Lucide Icons
- Shadcn UI (Card, Input, Label, Badge, Alert, Separator).

## 3. UI Structure & UX Requirements
- **Mobile-first Layout:** Vertical stacking for easy field data entry.
- **Auto-calculation:** Results must compute in real-time as the user types.
- **Layout Split (Use Tabs or distinct Card Sections):**
  - **Section 1: Thông số mẫu thép (Constants):** Nominal diameter, Specimen length.
  - **Section 2: Kiểm tra dung sai khối lượng (Mass Tolerance):** Input actual mass -> Auto-calculate kg/m, Tolerance (%), and evaluate Pass/Fail.
  - **Section 3: Kéo thép (Tensile Test):** Inputs for forces (kN) and final length -> Auto-calculate Yield Strength, Tensile Strength, and Elongation (%).

## 4. Variables, Formulas & Logic (State Management)

### Inputs: Section 1 (Constants)
- `diameter` (Đường kính danh định $d$ - mm) | Default: 16
- `massSampleLength` (Chiều dài đoạn cân khối lượng $L$ - m) | Default: 1
- `tensileInitialLength` (Chiều dài ban đầu đo độ giãn dài $L_0$ - mm) | Default: 160 (Usually $10 \times d$ or $5 \times d$)

### Inputs: Section 2 (Mass Measurement)
- `actualMass` (Khối lượng thực tế cân được $m_{thuc}$ - kg)

### Inputs: Section 3 (Tensile Test)
- `yieldForce` (Lực chảy $F_y$ - kN)
- `ultimateForce` (Lực đứt $F_u$ - kN)
- `finalLength` (Chiều dài sau khi đứt $L_u$ - mm)

---

### Calculations & Evaluation Logic
*Crucial: Handle `NaN`, `Infinity`, or Division by Zero gracefully.*

**Part A: Base Properties**
1. `nominalArea` (Diện tích danh định $A_0$ - mm²):
   `A0 = (Math.PI * Math.pow(diameter, 2)) / 4`
2. `nominalMass` (Khối lượng tiêu chuẩn 1m $m_{tc}$ - kg/m):
   `m_tc = 0.00785 * A0` *(Using density of steel = 7850 kg/m³)*

**Part B: Mass Tolerance (Dung sai khối lượng)**
3. `actualMassPerMeter` (Khối lượng 1m thực tế $m_{tt}$ - kg/m):
   `m_tt = actualMass / massSampleLength`
4. `massTolerance` (Sai lệch khối lượng $\Delta m$ - %):
   `tolerance = ((m_tt - m_tc) / m_tc) * 100`
5. **Evaluation Rule (TCVN 1651-2:2018):**
   - If `diameter <= 8`, allowed variance is `[-8, +8] %`.
   - If `diameter >= 10` AND `diameter <= 14`, allowed variance is `[-5, +5] %`.
   - If `diameter >= 16`, allowed variance is `[-4, +4] %`.
   - Define boolean `isMassPass` based on these rules.

**Part C: Tensile Properties**
6. `yieldStrength` (Giới hạn chảy $R_e$ - MPa):
   `Re = (yieldForce * 1000) / A0` *(Multiply by 1000 to convert kN to N)*
7. `tensileStrength` (Giới hạn bền $R_m$ - MPa):
   `Rm = (ultimateForce * 1000) / A0`
8. `elongation` (Độ giãn dài $A$ - %):
   `A = ((finalLength - tensileInitialLength) / tensileInitialLength) * 100`

---

## 5. Expected Output Details
- **Result Cards:** Create 2 distinct result highlight areas (one for Mass Tolerance, one for Tensile Strength).
- **Mass Tolerance UI:** Display calculated `tolerance %`. If `isMassPass` is true, show a Green badge ("ĐẠT"). If false, show a Red badge ("KHÔNG ĐẠT") and state the allowed limit for the chosen diameter.
- **Formatting:** Round Strength values (MPa) to 1 decimal place. Round Tolerance (%) and Elongation (%) to 1 decimal place. Round areas (mm²) and masses (kg/m) to 3 decimal places.
- Include a "Xóa dữ liệu" button to clear Sections 2 & 3.
- Output the complete, self-contained React component code.