# Task: Create ElasticModulusTest Component (Đo mô đun đàn hồi bằng tấm ép)

## 1. Context & Role
- **Role:** Expert React developer focusing on Mobile-first UI/UX for Civil Engineering.
- **Task:** Create a React component named `ElasticModulusTest` based on the Vietnamese standard 22 TCN 211-2006 (Appendix D) for calculating the Elastic Modulus of soil and pavement materials.

## 2. Tech Stack
- React (Next.js/Vite)
- Tailwind CSS
- Lucide Icons
- Shadcn UI (Card, Input, Label, Select/Dropdown, Alert).

## 3. UI Structure & UX Requirements
- **Mobile-first Layout:** Vertical stacking for easy field data entry.
- **Auto-calculation:** Results update in real-time as inputs change.
- **Layout Split:**
  - **Section 1: Thông số thiết bị & Vật liệu (Constants):** Dropdowns and inputs for Plate diameter, Load pressure, and Material type.
  - **Section 2: Số liệu đo hiện trường (Measurements):** Inputs for the Reversible Deformation (Biến dạng hồi phục) for 3 test points.
  - **Section 3: Kết quả (Results):** Display Modulus for each point, the Average Modulus, and a Validation Warning if the variance exceeds the allowed limit.

## 4. Variables & Formulas (State Management)

### Inputs: Section 1 (Constants)
- `plateDiameterD` (Đường kính tấm ép D - cm) | Default: 33 (Common size, user can edit to 30, 40, or 76).
- `loadPressureP` (Cấp tải trọng p - MPa) | Default: 0.5 (Typically 0.5-0.6 for materials, 0.2-0.25 for soil).
- `materialType` (Loại vật liệu / Hệ số Poisson $\mu$) | Dropdown options:
  - `soil`: Đất nền ($\mu$ = 0.35)
  - `material`: Vật liệu áo đường ($\mu$ = 0.25)
  - `structure`: Cả kết cấu áo đường ($\mu$ = 0.30)

### Inputs: Section 2 (Measurements - 3 Test Points)
- `l1` (Biến dạng hồi phục điểm 1 - mm)
- `l2` (Biến dạng hồi phục điểm 2 - mm)
- `l3` (Biến dạng hồi phục điểm 3 - mm)

### Calculations
*Note: Diameter `D` is in cm, so it must be multiplied by 10 to convert to mm to match `l` (mm) and `p` (MPa = N/mm²), resulting in `E` in MPa.*

1. **Calculate E for each point (i = 1, 2, 3):**
   `E_i = (Math.PI * loadPressureP * (plateDiameterD * 10) * (1 - Math.pow(mu, 2))) / (4 * l_i)`
2. **Calculate Average Modulus:**
   `E_avg = (E1 + E2 + E3) / 3` *(Round to 2 decimal places)*
3. **Validate Variance:**
   - `max_E = Math.max(E1, E2, E3)`
   - `min_E = Math.min(E1, E2, E3)`
   - `variance = ((max_E - min_E) / E_avg) * 100` (%)
   - Rule: The difference between measurements must not exceed 20%. 
   - `isValid = variance <= 20`

## 5. Expected Output & Logic Handling
- In Section 2, next to each input `l1, l2, l3`, display its respective calculated modulus `E1, E2, E3` in muted text (e.g., "E = 120.5 MPa").
- In Section 3, display the `E_avg` prominently.
- **Crucial Validation UI:** 
  - If `variance > 20%`, display a prominent Red Alert/Warning indicating: "Chênh lệch giữa các lần đo vượt quá 20% (Sai số: {variance}%). Cần đo lại!" and make the result card red/warning style.
  - If `variance <= 20%`, show a Green success badge: "Sai số đạt yêu cầu ({variance}%)".
- Handle division by zero or empty inputs gracefully (show "---" or "0.00" instead of `NaN` or `Infinity`).
- Provide a full, production-ready React component.