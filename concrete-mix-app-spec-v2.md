# SYSTEM PROMPT FOR VIBE CODING / ANTIGRAVITY
## PROJECT: CONCRETE MIX DESIGN & TRIAL BATCHING WEB APPLICATION (CẤP PHỐI BÊ TÔNG PRO - MULTI-STANDARD EDITION)

### 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)
Xây dựng ứng dụng web (Web App) chuyên nghiệp tính toán **Cấp phối Bê tông** đa tiêu chuẩn, hỗ trợ kỹ sư và phòng thí nghiệm LAS-XD chọn lựa 1 trong **4 Tiêu chuẩn tính toán khác nhau**. Khi người dùng thay đổi tiêu chuẩn, ứng dụng sẽ tự động chuyển đổi giao diện nhập liệu, công thức toán học và quy trình tính toán cấp phối tương ứng.

#### **Bộ 4 Tiêu chuẩn Tính toán:**
1. **QĐ 778/1998/QĐ-BXD**: Chỉ dẫn kỹ thuật chọn thành phần bê tông nặng thông thường (Sử dụng Cát tự nhiên mác đến M60 / B40).
2. **TCVN 10796:2015**: Chỉ dẫn thiết kế cấp phối bê tông sử dụng **Cát mịn** (Mô đun độ lớn $M_{đl} = 0,7 \div 2,0$).
3. **TCVN 9382:2012**: Chỉ dẫn kỹ thuật chọn thành phần bê tông sử dụng **Cát nghiền** (Crushed Sand từ đá tự nhiên).
4. **ACI 211.1-22**: Tiêu chuẩn Mỹ (American Concrete Institute) về thiết kế cấp phối bê tông khối lượng thể tích thông thường và bê tông nặng (Metric & Imperial).

Ứng dụng hỗ trợ 2 chế độ sản xuất chính:
- **Trộn thủ công / Cân đong thủ công**: Hệ số an toàn cường độ $K = 1.15$.
- **Trạm bê tông tươi / Trạm trộn tự động**: Hệ số an toàn cường độ $K = 1.10$.

Tích hợp **Mô-đun Tính toán Trộn thử đúc mẫu (Trial Batching Calculator)** cho phòng thí nghiệm với đầy đủ loại khuôn (Lập phương, Hình trụ, Dầm uốn) và xuất khối lượng chuẩn xác bằng **Gram**.

---

### 2. GIAO DIỆN CHỌN TIÊU CHUẨN & ĐỔI THÔNG SỐ ĐẦU VÀO (DYNAMIC INPUT FORM)

Giao diện nhập liệu sẽ tự động bổ sung/thay đổi các ô nhập liệu tùy theo tiêu chuẩn được chọn:

#### **A. Tiêu chuẩn 1: QĐ 778/1998/QĐ-BXD (Bê tông nặng - Cát tự nhiên)**
- **Đầu vào chính**:
  - Chế độ sản xuất: `[Trộn thủ công (K=1.15)`, `Trạm tự động (K=1.10)]`.
  - Cường độ: Mác bê tông $M$ (MPa) hoặc Cấp độ bền $B$.
  - Độ sụt yêu cầu $DS$ (cm).
  - Cốt liệu lớn: Loại `[Đá dăm, Sỏi]`, $D_{max}$ (10, 20, 40, 70 mm), Khối lượng riêng $\rho_d$, Khối lượng thể tích xốp $\rho_{vd}$, Độ rỗng $r_d$, Độ ẩm $W_d$.
  - Cốt liệu nhỏ: Cát tự nhiên, Mô đun độ lớn $M_{đl}$ ($2.0 \div 3.2$), Khối lượng riêng $\rho_c$, Độ ẩm $W_c$, Sỏi ngậm $>5$mm ($y\%$).
  - Xi măng: Mác xi măng (PCB30, PCB40, PC50...), Cường độ thực tế $R_x$ (MPa), Khối lượng riêng $\rho_x \approx 3.1$ g/cm³.
  - Phụ gia dẻo hóa: Mức giảm nước (%), Liều lượng (% xi măng).

#### **B. Tiêu chuẩn 2: TCVN 10796:2015 (Bê tông dùng Cát mịn)**
- **Bổ sung / Ràng buộc đặc thù**:
  - Mô đun độ lớn cát mịn $M_{đl}$ nhập trong khoảng $0.7 \div 2.0$.
  - **Cảnh báo mác giới hạn theo $M_{đl}$**:
    - $M_{đl} = 0.7 \div 1.0$: Chỉ áp dụng cho bê tông $<$ B15 (M200).
    - $M_{đl} = 1.1 \div 1.2$: Áp dụng cho bê tông $\le$ B25 (M350).
    - $M_{đl} = 1.3 \div 2.0$: Áp dụng cho bê tông $\le$ B45 (M600).
  - Tùy chọn `[Phối hợp cát mịn với cát thô/cát nghiền]` để tăng mô đun tổng hợp $M_{đl\_th} > 2.0$.

#### **C. Tiêu chuẩn 3: TCVN 9382:2012 (Bê tông dùng Cát nghiền)**
- **Bổ sung / Ràng buộc đặc thù**:
  - Khối lượng thể tích đổ đống của cát nghiền $\rho_{vc}$ (kg/m³), Độ rỗng cát nghiền $V_{r\_cát}$ (%).
  - Hàm lượng bột mịn $<0.15$mm trong cát nghiền (%): Thông thường $5\% \div 15\%$.
  - Lượng hạt $2.5 \div 5$mm trong cát nghiền (%): Khống chế $\le 20\%$.
  - Tùy chọn `[Pha trộn cát tự nhiên mịn]` (tỷ lệ $10\% \div 30\%$) để cải thiện độ dẻo và tính công tác.

#### **D. Tiêu chuẩn 4: ACI 211.1-22 (Tiêu chuẩn Mỹ ACI)**
- **Bổ sung / Ràng buộc đặc thù**:
  - Cường độ nén yêu cầu $f'_c$ (MPa hoặc psi).
  - **Tính cường độ trung bình target ($f'_{cr}$)**:
    - $f'_{cr} = f'_c + 8.3 \text{ MPa}$ (nếu $f'_c \le 35 \text{ MPa}$).
    - $f'_{cr} = 1.10 f'_c + 5.0 \text{ MPa}$ (nếu $f'_c > 35 \text{ MPa}$).
  - Loại bê tông: `[Không cuốn khí (Non-Air-Entrained)`, `Bê tông cuốn khí (Air-Entrained)]`.
  - Khối lượng thể tích đầm chặt khô của đá (Dry-Rodded Unit Weight - $\rho_{DRUW}$, kg/m³).
  - Điều kiện môi trường làm việc: Tra khống chế tỷ lệ $w/cm$ tối đa (Môi trường đóng băng, tiếp xúc Sulfate, chống thấm).

---

### 3. THUẬT TOÁN TÍNH TOÁN CHI TIẾT CHO NĂM 4 TIÊU CHUẨN (COMPUTATIONAL ENGINES)

---

#### 📐 BỘ MÁY 1: QĐ 778/1998/QĐ-BXD (CÁT TỰ NHIÊN THÔNG THƯỜNG)

1. **Cường độ tính toán ($R_n$)**: 
   $$R_n = M \times K \quad (K=1.15 \text{ hoặc } 1.10)$$
2. **Lượng nước trộn ban đầu ($N$)**: Tra bảng QĐ 778 theo $D_{max}$ đá, độ sụt $DS$, loại cát tự nhiên.
3. **Tỷ lệ $X/N$ (Phương trình Skramtaev)**:
   - Nếu $X/N \le 2.5$: $\frac{X}{N} = \frac{R_n}{A \cdot R_x} + 0.5$
   - Nếu $X/N > 2.5$: $\frac{X}{N} = \frac{R_n}{A_1 \cdot R_x} - 0.5$
   *(với $A, A_1$ tra bảng chất lượng cốt liệu đá dăm/sỏi)*.
4. **Lượng Xi măng ($X$) & Phụ gia ($PG$)**:
   $$X = \left(\frac{X}{N}\right) \times N, \quad PG = X \times \frac{\text{liều lượng \%}}{100}$$
5. **Thể tích hồ xi măng ($V_h$) & Lượng Đá ($D$)**:
   $$V_h = \frac{X}{\rho_x} + N \quad (\text{lít})$$
   $$D = \frac{1000}{\frac{1000 \cdot r_d \cdot K_d}{\rho_{vd}} + \frac{1}{\rho_d}} \quad (\text{kg/m}^3)$$
   *(với $K_d$ là hệ số dư vữa tra bảng theo $V_h$ và $M_{đl}$ cát)*.
6. **Lượng Cát ($C$)**: Phương pháp thể tích tuyệt đối:
   $$C = \left[ 1000 - \left( \frac{X}{\rho_x} + \frac{D}{\rho_d} + \frac{N}{\rho_n} + \frac{PG}{\rho_{pg}} \right) \right] \times \rho_c \quad (\text{kg/m}^3)$$

---

#### 📐 BỘ MÁY 2: TCVN 10796:2015 (CÁT MỊN $M_{đl} = 0.7 \div 2.0$)

1. **Điều chỉnh Lượng nước ($N$)**:
   - Cát mịn có diện tích bề mặt lớn, lượng nước $N$ tăng thêm $5 \div 15$ lít/m³ so với cát thô (hoặc bắt buộc dùng phụ gia giảm nước $\ge 10\%$).
2. **Điều chỉnh Hệ số $A, A_1$ trong Skramtaev**:
   - Hệ số chất lượng vật liệu $A, A_1$ được nhân với hệ số hiệu chỉnh $k_m < 1.0$ phụ thuộc vào $M_{đl}$ của cát mịn:
     $$A_{mịn} = A \times (0.85 + 0.075 \times M_{đl})$$
3. **Tính $X/N$, Xi măng $X$**: Tính theo $A_{mịn}$ điều chỉnh.
4. **Hệ số dư vữa $K_d$ cho Cát mịn**:
   - Tra bảng $K_d$ riêng cho cát mịn trong TCVN 10796 (giá trị $K_d$ thường lớn hơn cát thô $0.05 \div 0.15$ để bao bọc hạt mịn).
5. **Tính Đá ($D$) và Cát mịn ($C$)**: Tính tương tự phương pháp thể tích tuyệt đối.
6. **Nếu Phối hợp Cát mịn + Cát thô**:
   - Tỷ lệ phối hợp cát thô $x_c = \frac{M_{đl\_yêu\_cầu} - M_{đl\_mịn}}{M_{đl\_thô} - M_{đl\_mịn}}$.

---

#### 📐 BỘ MÁY 3: TCVN 9382:2012 (CÁT NGHIỀN)

1. **Lượng nước trộn ban đầu ($N$)**:
   - Cát nghiền có sắc cạnh làm tăng độ chèn chặt, lượng nước trộn được tra theo Bảng 2 TCVN 9382 (phụ thuộc hàm lượng bột mịn $<0.15$mm và độ sụt $DS$).
2. **Hệ số $A, A_1$ cho Cát nghiền**:
   - Tra bảng hệ số $A, A_1$ riêng theo độ rỗng của cát nghiền và loại đá sản xuất cát nghiền.
3. **Lượng Đá dăm ($D$)**:
   - Cát nghiền có thể áp dụng phương pháp thể tích tuyệt đối hoặc phương pháp thể tích đổ đống đá dăm:
     $$D = \frac{1000 \cdot \rho_{vd}}{1000 \cdot r_d \cdot K_d + \frac{\rho_{vd}}{\rho_d}}$$
4. **Lượng Cát nghiền ($C$)**:
   $$C = \left[ 1000 - \left( \frac{X}{\rho_x} + \frac{D}{\rho_d} + \frac{N}{\rho_n} + \frac{PG}{\rho_{pg}} \right) \right] \times \rho_c$$
5. **Hiệu chỉnh pha cát tự nhiên**: Nếu phối trộn $20\%$ cát tự nhiên, phân chia lượng $C$ thành $80\% C_{nghiền} + 20\% C_{tự\_nhiên}$.

---

#### 📐 BỘ MÁY 4: ACI 211.1-22 (TIÊU CHUẨN MỸ ACI)

1. **Cường độ thiết kế target ($f'_{cr}$)**:
   $$f'_{cr} = f'_c + 8.3 \text{ MPa} \quad (\text{khi } f'_c \le 35 \text{ MPa})$$
2. **Lượng nước ($w$) và Lượng khí cuốn ($V_{air}$)**:
   - Tra Bảng ACI 211.1 theo độ sụt $DS$ và kích thước $D_{max}$ đá.
   - Bê tông không cuốn khí: $V_{air} \approx 0.5\% \div 3\%$.
   - Bê tông cuốn khí: $V_{air} \approx 3.5\% \div 8\%$.
3. **Tỷ lệ Nước/Chất binder ($w/cm$)**:
   - Tra Bảng 6.3.4(a) ACI 211.1 theo cường độ $f'_{cr}$.
   - Khống chế theo điều kiện môi trường khắt khe (nếu có).
4. **Lượng Xi măng ($c$)**:
   $$c = \frac{w}{w/cm} \quad (\text{kg/m}^3)$$
5. **Thể tích Đá đầm chặt khô ($V_0$) & Lượng Đá ($D$)**:
   - Tra Bảng 6.3.6 ACI 211.1 lấy tỷ lệ $V_0/V_{bê\_tông}$ dựa trên $D_{max}$ đá và Mô đun độ lớn cát $M_{đl}$.
   $$D = V_0 \times \rho_{DRUW} \quad (\text{kg/m}^3)$$
6. **Lượng Cát ($C$)**: Phương pháp thể tích tuyệt đối ACI:
   $$V_{cát} = 1.0 - \left( \frac{c}{\rho_x \cdot 1000} + \frac{w}{1000} + \frac{D}{\rho_d \cdot 1000} + \frac{V_{air}\%}{100} \right)$$
   $$C = V_{cát} \times \rho_c \times 1000 \quad (\text{kg/m}^3)$$

---

### 4. MÔ-ĐUN TRỘN THỬ & ĐÚC MẪU PHÒNG THÍ NGHIỆM (TRIAL BATCHING - COMMON MODULE)

Mô-đun dùng chung cho cả 4 tiêu chuẩn để đúc mẫu thí nghiệm kiểm tra cường độ:

1. **Khuôn đúc**:
   - Lập phương: $15\times15\times15$ cm ($3.375$L), $10\times10\times10$ cm ($1.0$L), $20\times20\times20$ cm ($8.0$L).
   - Hình trụ: $\Phi 15\times30$ cm ($5.301$L), $\Phi 10\times20$ cm ($1.571$L).
   - Dầm uốn: $15\times15\times60$ cm ($13.5$L), $10\times10\times40$ cm ($4.0$L).
   - Tự chọn: $a \times b \times c$ (cm).
2. **Thể tích mẻ trộn phòng thí nghiệm ($V_{trộn}$)**:
   $$V_{trộn} = \left( N_{mẫu} \times V_{khuôn} + V_{thử\_độ\_sụt} \right) \times k_{hao\_hụt}$$
   *(với $V_{thử\_độ\_sụt} = 8.0$ lít nếu chọn thử độ sụt; $k_{hao\_hụt} = 1.15 \div 1.30$ bù dính thùng trộn)*.
3. **Cân đong đĩa thí nghiệm (GRAM)**:
   $$M_{thí\_nghiệm\_g} = M_{1m3\_hiện\_trường} \times \frac{V_{trộn}}{1000} \times 1000 \quad (\text{g})$$

---

### 5. XUẤT PHIẾU CẤP PHỐI CHUẨN LAS-XD & IN PDF
- Nút `In Phiếu Cấp Phối (PDF)` tự động kích hoạt giao diện xem trước trang in A4 chuẩn LAS-XD.
- Bao gồm:
  - Tên Dự án, Hạng mục, Tiêu chuẩn áp dụng (Hiển thị rõ 1 trong 4 tiêu chuẩn đã chọn).
  - Bảng thành phần $1\text{m}^3$ (Khô & Hiện trường).
  - Bảng cân đong mẻ trộn máy & mẻ đúc mẫu thí nghiệm (đơn vị Gram).
  - Chữ ký Kỹ thuật viên thí nghiệm & Trưởng phòng LAS-XD.
