# SYSTEM PROMPT FOR VIBE CODING / ANTIGRAVITY (VERSION 3.0)
## PROJECT: DYNAMIC MULTI-STANDARD CONCRETE MIX DESIGN WEB APP (CẤP PHỐI BÊ TÔNG PRO - 4 TIÊU CHUẨN)

### 1. TỔNG QUAN NÂNG CẤP (DYNAMIC INPUT SCHEMA OVERVIEW)
Ứng dụng WebApp tính toán **Cấp phối Bê tông** cho phép người dùng lựa chọn linh hoạt giữa **4 Tiêu chuẩn thiết kế khác nhau**. Khi chuyển đổi tiêu chuẩn (Select Dropdown), **Form dữ liệu đầu vào (UI Input Schema) sẽ tự động thay đổi linh hoạt (Dynamic Form)** để chỉ hiển thị đúng và đủ các thông số kỹ thuật đặc thù mà tiêu chuẩn đó yêu cầu.

#### 4 Tiêu chuẩn được hỗ trợ:
1. **QĐ 778/1998/QĐ-BXD**: Bê tông nặng thông thường dùng cát sông tự nhiên thô ($M_{đl} \ge 2.0$).
2. **TCVN 10796:2015**: Bê tông sử dụng Cát mịn tự nhiên ($M_{đl} = 0.7 \div 2.0$).
3. **TCVN 9382:2012**: Bê tông sử dụng Cát nghiền từ đá tự nhiên.
4. **ACI 211.1-22**: Tiêu chuẩn Mỹ (American Concrete Institute) cho Bê tông khối lượng thể tích thông thường và bê tông nặng.

---

### 2. MA TRẬN DỮ LIỆU ĐẦU VÀO LINH HOẠT THEO TỪNG TIÊU CHUẨN (DYNAMIC INPUT MATRIX)

```
+---------------------------------------------------------------------------------------------------+
|                                  SELECT STANDARD (CHỌN TIÊU CHUẨN)                                 |
|   [1. QĐ 778/1998 (Cát thô)] | [2. TCVN 10796 (Cát mịn)] | [3. TCVN 9382 (Cát nghiền)] | [4. ACI 211.1-22 (Mỹ)]  |
+---------------------------------------------------------------------------------------------------+
                                                  |
       +----------------------+-------------------+----------------------+----------------------+
       |                      |                                          |                      |
       v                      v                                          v                      v
[FORM 1: QĐ 778]      [FORM 2: TCVN 10796]                      [FORM 3: TCVN 9382]    [FORM 4: ACI 211.1]
- Mác M / Cấp B       - Thừa hưởng Form 1                       - Thừa hưởng Form 1     - Specified f'c (MPa/psi)
- Chế độ trộn K       - Bổ sung:                                - Bổ sung:              - Over-design f'cr
- Độ sụt DS (cm)        * M_đl cát mịn (0.7-2.0)                  * Hàm lượng bột đá     - Air Entrainment (Có/Không)
- Xi măng Rx, rho_x     * Độ hút nước cát mịn (%)                  <0.15mm (%)          - Exposure Condition (Severe/Mod)
- Đá/Sỏi Dmax, rho_d,   * Bật/Tắt Phối hợp Cát thô/nghiền         * Hạt dẹt 2.5-5mm (%)   - Coarse Agg Dry-Rodded Unit Wt
  rho_vd, r_d, W_d      * Tự động Validation giới hạn Mác theo    * Độ rỗng cát nghiền   - Specific Gravity (SSD)
- Cát thô M_đl, rho_c,    M_đl cát mịn                            * % Cát tự nhiên phối   - SCMs (Tro bay/Xỉ/Silica)
  W_c, y% (>5mm)
```

---

### 3. CHI TIẾT DỮ LIỆU ĐẦU VÀO VÀ QUY TẮC RÀNG BUỘC CHO TỪNG TIÊU CHUẨN

#### 📋 TIÊU CHUẨN 1: QĐ 778/1998/QĐ-BXD (Cát sông tự nhiên thô)
**Trường dữ liệu đầu vào (Input Fields):**
- **Thông số Bê tông**:
  - *Chế độ sản xuất*: Select [`Trộn thủ công / Cân đong thủ công (K = 1.15)`, `Trạm bê tông tươi / Tự động (K = 1.10)`].
  - *Cường độ*: Select Mác bê tông $M$ [M100 $\div$ M600] hoặc Cấp độ bền $B$ [B7.5 $\div$ B45].
  - *Độ sụt yêu cầu ($DS$)*: Select/Nhập [1-2, 3-5, 6-9, 10-14, 15-18 cm].
  - *Chống thấm (Optional)*: Tick box [B2, B4, B6, B8, B10, B12] $ightarrow$ Tự động kiểm tra $X/N$ tối thiểu.
- **Xi măng**:
  - *Loại xi măng*: PCB30, PCB40, PC50. Cường độ $R_x$ (MPa), Khối lượng riêng $ho_x = 3.1 	ext{ g/cm}^3$.
- **Đá/Sỏi (Cốt liệu lớn)**:
  - *Loại*: Đá dăm hoặc Sỏi. Kích thước lớn nhất $D_{max}$ [10, 20, 40, 70 mm].
  - *Khối lượng riêng $ho_d$* ($g/cm^3$), *Khối lượng thể tích xốp $ho_{vd}$* ($kg/m^3$), *Độ rỗng $r_d$* (%), *Độ ẩm $W_d$* (%).
- **Cát sông (Cốt liệu nhỏ)**:
  - *Mô đun độ lớn $M_{đl}$*: $2.0 \div 3.2$. Khối lượng riêng $ho_c$ ($g/cm^3$), Độ ẩm $W_c$ (%), Hàm lượng sỏi ngậm $y\%$ (hạt $>5$mm).
- **Phụ gia**: Mức giảm nước (%), Liều lượng (% XM).

---

#### 📋 TIÊU CHUẨN 2: TCVN 10796:2015 (Bê tông dùng Cát mịn)
**Trường dữ liệu thay đổi / Bổ sung (Dynamic Fields):**
- **Mô đun độ lớn cát mịn ($M_{đl}$)**: Giới hạn dải nhập $0.7 \div 2.0$.
  - *Quy tắc Ràng buộc (Validation Rules)*:
    - Nếu $M_{đl} = 0.7 \div 1.0 ightarrow$ Cảnh báo & Khống chế mác tối đa $\le B15$ (M200).
    - Nếu $M_{đl} = 1.1 \div 1.2 ightarrow$ Khống chế mác tối đa $\le B25$ (M300).
    - Nếu $M_{đl} = 1.3 \div 2.0 ightarrow$ Dùng cho bê tông đến B45.
- **Độ hút nước của Cát mịn ($W_{hút\_cát}$ %)**: Nhập độ hút nước đặc thù của cát mịn ($1.5\% \div 3.5\%$).
- **Hệ số chất lượng vật liệu hiệu chỉnh ($A_{mịn}$)**:
  $$A_{mịn} = A \cdot (0.85 + 0.075 \cdot M_{đl})$$
- **Chế độ Phối hợp Cát (Sand Blending Toggle)**:
  - Toggle [Tắt / Bật Phối hợp Cát].
  - Nếu Bật: Nhập Loại cát phối (Cát thô $M_{đl\_thô} = 2.8$ hoặc Cát nghiền), Nhập Tỷ lệ phối $k_{phối}$ (%) $ightarrow$ Tự động tính mô đun độ lớn hỗn hợp $M_{đl\_tổng\_hợp}$.

---

#### 📋 TIÊU CHUẨN 3: TCVN 9382:2012 (Bê tông dùng Cát nghiền)
**Trường dữ liệu thay đổi / Bổ sung (Dynamic Fields):**
- **Hàm lượng bột đá / hạt mịn $< 0.15$mm (%)**:
  - Nhập tỷ lệ % bột mịn ($5\% \div 15\%$). 
  - *Validation*: Cảnh báo nếu hạt mịn $> 10\%$ đối với bê tông mác $> B30$.
- **Hàm lượng hạt dẹt/tấm $2.5 \div 5$mm (%)**: Nhập % hạt dẹt (Quy định $\le 20\%$).
- **Độ rỗng đổ đống của Cát nghiền ($r_c$ %)**: Nhập độ rỗng xốp ($38\% \div 45\%$).
- **Hình dạng hạt cát nghiền**: Select [`Sắc cạnh (Đá nghiền)`, `Bo tròn vừa`, `Hỗn hợp`].
- **Lượng nước trộn ($N$)**: Tra theo Bảng 2 TCVN 9382 (tự động cộng $5 \div 15$ lít do cát nghiền hút nước và sắc cạnh).
- **Tính năng Phối trộn Cát tự nhiên**: Allow input % Cát tự nhiên mịn pha thêm ($10\% \div 30\%$) để cải thiện tính dẻo.

---

#### 📋 TIÊU CHUẨN 4: ACI 211.1-22 (Tiêu chuẩn ACI Mỹ)
**Trường dữ liệu hoàn toàn mới theo Hệ thống ACI (Dynamic Fields):**
- **Specified Compressive Strength ($f'_c$)**: Nhập bằng MPa (vd: 20, 25, 30, 35, 40 MPa) hoặc psi (3000, 4000, 5000 psi).
- **Target Average Strength ($f'_{cr}$)**: Tự động tính theo công thức ACI:
  - Nếu $f'_c \le 35 	ext{ MPa} ightarrow f'_{cr} = f'_c + 8.3 	ext{ MPa}$ ($f'_c + 1200 	ext{ psi}$).
  - Nếu $f'_c > 35 	ext{ MPa} ightarrow f'_{cr} = 1.10 f'_c + 5.0 	ext{ MPa}$.
- **Cuốn khí (Air Entrainment)**: Select [`Non-Air-Entrained Concrete`, `Air-Entrained Concrete`].
- **Môi trường xâm hại (Exposure Condition)**: Select [`Mild Exposure` (Thường), `Moderate Exposure` (Xâm hại vừa), `Severe Exposure` (Xâm hại nặng - băng giá/hóa chất)].
  - Tự động xác định hàm lượng khí cuốn ($1.5\% \div 7.5\%$) và khống chế tỷ lệ $w/cm$ tối đa ($0.40 \div 0.50$).
- **Coarse Aggregate Dry-Rodded Unit Weight ($\gamma_{DRUW}$)**: Nhập khối lượng thể tích đầm chặt khô của đá ($1500 \div 1750 	ext{ kg/m}^3$).
- **Specific Gravity (SSD) - Khối lượng riêng bão hòa khô bề mặt**:
  - Cement ($3.15$), Coarse Aggregate SSD ($2.65 \div 2.75$), Fine Aggregate SSD ($2.60 \div 2.70$).
- **Fineness Modulus of Fine Aggregate (FM)**: $2.40 \div 3.00$.
- **Supplementary Cementitious Materials (SCMs)**:
  - Checkbox [Fly Ash (Tro bay) / Slag (Xỉ lò cao) / Silica Fume]. Nhập % thay thế ($15\% \div 30\%$) và khối lượng riêng SCM.

---

### 4. THUẬT TOÁN XỬ LÝ THEO FORM LINH HOẠT (DYNAMIC CALCULATION ENGINE)

Khi người dùng nhấn **"Tính Cấp Phối"**, hệ thống kiểm tra Tiêu chuẩn đang chọn và kích hoạt Động cơ tính toán tương ứng:

```javascript
switch(selectedStandard) {
  case 'QD778':
    return calculateQD778(inputs);
  case 'TCVN10796':
    return calculateTCVN10796(inputs);
  case 'TCVN9382':
    return calculateTCVN9382(inputs);
  case 'ACI211':
    return calculateACI211(inputs);
}
```

#### Tóm tắt các bước tính toán ACI 211.1-22 trong Engine:
1. **Bước 1**: Chọn Slump range & Tính Target Strength $f'_{cr}$.
2. **Bước 2**: Tra lượng nước ($W$) và % Khí cuốn ($A\%$) theo $D_{max}$ đá và Air-Entrainment toggle.
3. **Bước 3**: Tra tỷ lệ $w/cm$ từ bảng ACI theo $f'_{cr}$ và điều kiện môi trường.
4. **Bước 4**: Tính lượng chất kết dính $cm = W / (w/cm)$.
5. **Bước 5**: Tra thể tích đá đầm chặt khô ($V_{DRUW}$) theo $D_{max}$ và Fineness Modulus (FM) của cát.
   $$	ext{Đá dăm khô (kg/m}^3) = V_{DRUW} 	imes \gamma_{DRUW}$$
6. **Bước 6**: Tính lượng Cát bằng Phương pháp thể tích tuyệt đối hoặc Phương pháp khối lượng:
   $$V_{cát} = 1000 - \left( rac{cm}{ho_{cm}} + rac{	ext{Đá}}{ho_{đá}} + rac{W}{1000} + rac{A\% 	imes 1000}{100} ight)$$
   $$	ext{Cát khô (kg/m}^3) = V_{cát} 	imes ho_{cát}$$
7. **Bước 7**: Hiệu chỉnh ẩm theo độ ẩm tổng và độ hút nước của cốt liệu.

---

### 5. MÔ-ĐUN TRỘN THỬ ĐÚC MẪU (TRIAL BATCHING) & IN PHIẾU LAS-XD

Mô-đun đúc mẫu thí nghiệm áp dụng đồng nhất cho cả 4 tiêu chuẩn:
- Tự động lấy kết quả cấp phối $1	ext{m}^3$ vừa tính theo tiêu chuẩn được chọn.
- Nhập Số lượng mẫu, Loại khuôn (Lập phương $15	imes15	imes15, 10	imes10	imes10, 20	imes20	imes20	ext{ cm}$; Hình trụ $\Phi 15	imes30, \Phi 10	imes20	ext{ cm}$; Dầm uốn $15	imes15	imes60	ext{ cm}$), Bật/Tắt thử độ sụt ($8.0$L), Hệ số hao hụt thùng trộn ($1.15 \div 1.30$).
- Tự động tính khối lượng vật liệu cần cân đĩa ra **GRAM**.
- **Xuất Phiếu Thí Nghiệm LAS-XD (PDF/Print)**: Hiển thị rõ tiêu chuẩn áp dụng (vd: "TIÊU CHUẨN ÁP DỤNG: TCVN 10796:2015 - CÁT MỊN" hoặc "TIÊU CHUẨN ÁP DỤNG: ACI 211.1-22").
