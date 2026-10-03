# Mã Nguồn Single-File Web App Tính Toán Cấp Phối Bê Tông & Đúc Mẫu Thử

> **Ứng dụng WebApp tĩnh (Standalone HTML/TailwindCSS/Vue.js)**
> Tự động thực hiện các phép tính cấp phối bê tông cho **1 m³** và **Mẻ trộn đúc mẫu phòng thí nghiệm**.

---

## 🚀 Cách Sử Dụng File Mã Nguồn Này:

1. **Sao chép toàn bộ mã nguồn HTML trong thẻ code dưới đây.**
2. Tạo một file mới trên máy tính của bạn có tên: `concrete-mix-app.html`.
3. Mở trực tiếp file `concrete-mix-app.html` bằng bất kỳ trình duyệt web nào (Chrome, Edge, Firefox, Safari) mà **không cần cài đặt server hay môi trường phức tạp**.
4. Hoặc bạn có thể dán đoạn mã này vào Antigravity / Cursor / VSCode / Replit để tiếp tục tùy biến giao diện hoặc phát triển thêm tính năng.

---

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tính Toán Cấp Phối Bê Tông & Đúc Mẫu Thử - TCVN & ACI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-100 text-slate-800 font-sans antialiased">
    <div id="app" class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 shadow-lg">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <i class="fa-solid to-building-columns text-3xl text-yellow-400"></i>
                    <div>
                        <h1 class="text-2xl font-bold">Ứng Dụng Tính Toán Cấp Phối Bê Tông</h1>
                        <p class="text-xs text-blue-200">Theo TCVN 10796:2015, TCVN 9382:2012, QĐ 778/1998 & ACI 211.1</p>
                    </div>
                </div>
                <span class="bg-blue-600/60 text-blue-100 text-xs px-3 py-1 rounded-full border border-blue-400">v2.0 Standalone</span>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Sidebar / Inputs Column (5 cols) -->
            <section class="lg:col-span-5 space-y-6">
                <!-- Chế độ trộn -->
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h2 class="text-lg font-semibold text-slate-700 border-b pb-2 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-sliders text-blue-600"></i> Chế Độ Sản Xuất / Trộn
                    </h2>
                    <div class="space-y-3">
                        <label class="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors" :class="mixMode === 'auto' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'">
                            <input type="radio" v-model="mixMode" value="auto" class="text-blue-600">
                            <div>
                                <span class="font-medium text-slate-800">Trạm Bê Tông Tươi Tự Động</span>
                                <p class="text-xs text-slate-500">Hệ số an toàn K = 1.10 (Cân đong tự động chuẩn xác)</p>
                            </div>
                        </label>

                        <label class="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors" :class="mixMode === 'manual' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'">
                            <input type="radio" v-model="mixMode" value="manual" class="text-blue-600">
                            <div>
                                <span class="font-medium text-slate-800">Trộn Thủ Công / Công Trường</span>
                                <p class="text-xs text-slate-500">Hệ số an toàn K = 1.15 (Đong đếm thể tích thủ công)</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Thông số Bê tông & Xi măng -->
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h2 class="text-lg font-semibold text-slate-700 border-b pb-2 mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-cubes text-blue-600"></i> Thông Số Yêu Cầu
                    </h2>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Mác bê tông (M)</label>
                            <select v-model.number="macBetong" class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                                <option :value="150">M150 (B10)</option>
                                <option :value="200">M200 (B15)</option>
                                <option :value="250">M250 (B20)</option>
                                <option :value="300">M300 (B22.5)</option>
                                <option :value="350">M350 (B25)</option>
                                <option :value="400">M400 (B30)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Cường độ Xi măng Rx</label>
                            <select v-model.number="macXimang" class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                                <option :value="30">PCB 30 (30 MPa)</option>
                                <option :value="40">PCB 40 (40 MPa)</option>
                                <option :value="50">PC 50 (50 MPa)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Độ sụt yêu cầu (cm)</label>
                            <input type="number" v-model.number="doSut" min="2" max="22" class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">D_max của đá (mm)</label>
                            <select v-model.number="dMax" class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5">
                                <option :value="10">10 mm</option>
                                <option :value="20">20 mm</option>
                                <option :value="40">40 mm</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Mô đun M_đl của cát</label>
                            <input type="number" v-model.number="mDl" step="0.1" min="0.7" max="3.5" class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Loại đá/sỏi</label>
                            <select v-model="loaiDa" class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5">
                                <option value="da_dam">Đá dăm (Góc cạnh)</option>
                                <option value="soi">Sỏi tự nhiên (Tròn)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Phụ gia & Độ ẩm -->
                    <div class="pt-2 border-t border-slate-100">
                        <label class="flex items-center space-x-2 mb-3">
                            <input type="checkbox" v-model="coPhuGia" class="rounded text-blue-600">
                            <span class="text-sm font-medium text-slate-700">Sử dụng phụ gia dẻo hóa / giảm nước</span>
                        </label>
                        <div v-if="coPhuGia" class="grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-300 my-2">
                            <div>
                                <label class="block text-xs text-slate-500 mb-1">Liều lượng (% xi măng)</label>
                                <input type="number" v-model.number="lieuLuongPG" step="0.1" min="0.5" max="2" class="w-full bg-slate-50 border border-slate-300 text-xs rounded p-2">
                            </div>
                            <div>
                                <label class="block text-xs text-slate-500 mb-1">% Giảm nước</label>
                                <input type="number" v-model.number="phanTramGiamNuoc" step="1" min="5" max="30" class="w-full bg-slate-50 border border-slate-300 text-xs rounded p-2">
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div>
                            <label class="block text-xs text-slate-600 mb-1">Độ ẩm Cát Wc (%)</label>
                            <input type="number" v-model.number="wc" step="0.5" min="0" max="10" class="w-full bg-slate-50 border border-slate-300 text-xs rounded p-2">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-600 mb-1">Độ ẩm Đá Wd (%)</label>
                            <input type="number" v-model.number="wd" step="0.2" min="0" max="5" class="w-full bg-slate-50 border border-slate-300 text-xs rounded p-2">
                        </div>
                    </div>
                </div>
            </section>

            <!-- Results Column (7 cols) -->
            <section class="lg:col-span-7 space-y-6">
                <!-- Card Kết quả 1m3 -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-calculator text-indigo-600"></i> Thành Phần Cho 1 m³ Bê Tông Tươi
                        </h2>
                        <span class="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-1 rounded-md">Rn = {{ rn.toFixed(1) }} MPa</span>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                            <span class="text-xs text-slate-500 block uppercase font-medium">Xi măng</span>
                            <span class="text-xl font-bold text-slate-800">{{ result1m3.X.toFixed(1) }}</span>
                            <span class="text-xs text-slate-500"> kg</span>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                            <span class="text-xs text-slate-500 block uppercase font-medium">Nước thực tế</span>
                            <span class="text-xl font-bold text-blue-600">{{ result1m3.N_hh.toFixed(1) }}</span>
                            <span class="text-xs text-slate-500"> Lít</span>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                            <span class="text-xs text-slate-500 block uppercase font-medium">Cát thực tế</span>
                            <span class="text-xl font-bold text-amber-700">{{ result1m3.C_hh.toFixed(1) }}</span>
                            <span class="text-xs text-slate-500"> kg</span>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                            <span class="text-xs text-slate-500 block uppercase font-medium">Đá thực tế</span>
                            <span class="text-xl font-bold text-slate-700">{{ result1m3.D_hh.toFixed(1) }}</span>
                            <span class="text-xs text-slate-500"> kg</span>
                        </div>
                    </div>

                    <div class="text-xs text-slate-500 flex justify-between px-1">
                        <span>Tỷ lệ X/N: <strong class="text-slate-800">{{ result1m3.X_N.toFixed(2) }}</strong></span>
                        <span>Phụ gia PG: <strong class="text-slate-800">{{ result1m3.PG.toFixed(2) }} kg</strong></span>
                    </div>
                </div>

                <!-- Card Trộn thử đúc mẫu phòng thí nghiệm -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                    <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-vial text-amber-600"></i> Tính Toán Trộn Thử Đúc Mẫu Thử
                    </h2>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Loại khuôn đúc mẫu</label>
                            <select v-model="selectedKhuon" class="w-full bg-slate-50 border border-slate-300 text-xs rounded-lg p-2.5">
                                <option value="cube15">Khuôn lập phương 15x15x15 cm (3.375 Lít)</option>
                                <option value="cube10">Khuôn lập phương 10x10x10 cm (1.000 Lít)</option>
                                <option value="cube20">Khuôn lập phương 20x20x20 cm (8.000 Lít)</option>
                                <option value="cyl15">Khuôn hình trụ Phi 15x30 cm (5.301 Lít)</option>
                                <option value="beam15">Khuôn dầm uốn 15x15x60 cm (13.50 Lít)</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Số lượng mẫu</label>
                                <input type="number" v-model.number="soLuongMau" min="1" max="30" class="w-full bg-slate-50 border border-slate-300 text-xs rounded-lg p-2.5">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Hệ số dính k</label>
                                <input type="number" v-model.number="heSoHaoHut" step="0.05" min="1.1" max="1.5" class="w-full bg-slate-50 border border-slate-300 text-xs rounded-lg p-2.5">
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4 text-xs">
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" v-model="coSlumpTest" class="rounded text-amber-600">
                            <span>Tính thêm 8 Lít cho thử độ sụt (Slump Test)</span>
                        </label>
                        <span class="font-bold text-amber-900">Tổng V mẻ = {{ vMeTronLit.toFixed(2) }} Lít</span>
                    </div>

                    <!-- Bảng vật liệu cân đong cho phòng thí nghiệm -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left text-slate-700 border">
                            <thead class="bg-slate-100 text-slate-700 uppercase font-bold border-b">
                                <tr>
                                    <th class="p-2.5">Vật liệu</th>
                                    <th class="p-2.5 text-right">Khối lượng (Kg)</th>
                                    <th class="p-2.5 text-right">Khối lượng Cân (Gram)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr class="hover:bg-slate-50">
                                    <td class="p-2.5 font-medium">Xi măng (X)</td>
                                    <td class="p-2.5 text-right font-semibold">{{ (result1m3.X * vMeTronM3).toFixed(3) }} kg</td>
                                    <td class="p-2.5 text-right font-bold text-blue-700">{{ (result1m3.X * vMeTronM3 * 1000).toFixed(1) }} g</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-2.5 font-medium">Cát thực tế (C_ẩm)</td>
                                    <td class="p-2.5 text-right font-semibold">{{ (result1m3.C_hh * vMeTronM3).toFixed(3) }} kg</td>
                                    <td class="p-2.5 text-right font-bold text-amber-700">{{ (result1m3.C_hh * vMeTronM3 * 1000).toFixed(1) }} g</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-2.5 font-medium">Đá thực tế (Đ_ẩm)</td>
                                    <td class="p-2.5 text-right font-semibold">{{ (result1m3.D_hh * vMeTronM3).toFixed(3) }} kg</td>
                                    <td class="p-2.5 text-right font-bold text-slate-800">{{ (result1m3.D_hh * vMeTronM3 * 1000).toFixed(1) }} g</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-2.5 font-medium">Nước trộn (N_tt)</td>
                                    <td class="p-2.5 text-right font-semibold">{{ (result1m3.N_hh * vMeTronM3).toFixed(3) }} Lít</td>
                                    <td class="p-2.5 text-right font-bold text-blue-600">{{ (result1m3.N_hh * vMeTronM3 * 1000).toFixed(1) }} ml/g</td>
                                </tr>
                                <tr v-if="coPhuGia" class="hover:bg-slate-50 bg-blue-50/30">
                                    <td class="p-2.5 font-medium">Phụ gia dẻo hóa (PG)</td>
                                    <td class="p-2.5 text-right font-semibold">{{ (result1m3.PG * vMeTronM3).toFixed(4) }} kg</td>
                                    <td class="p-2.5 text-right font-bold text-indigo-700">{{ (result1m3.PG * vMeTronM3 * 1000).toFixed(2) }} g</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    mixMode: 'auto',
                    macBetong: 250,
                    macXimang: 400,
                    doSut: 8,
                    dMax: 20,
                    mDl: 2.2,
                    loaiDa: 'da_dam',
                    coPhuGia: false,
                    lieuLuongPG: 1.0,
                    phanTramGiamNuoc: 12,
                    wc: 3.0,
                    wd: 1.0,
                    selectedKhuon: 'cube15',
                    soLuongMau: 6,
                    heSoHaoHut: 1.20,
                    coSlumpTest: true
                }
            },
            computed: {
                kFactor() { return this.mixMode === 'auto' ? 1.10 : 1.15; },
                rn() { return this.macBetong * this.kFactor; },
                result1m3() {
                    let N_base = 185 + (this.doSut - 4) * 4.5;
                    if (this.dMax === 10) N_base = 200 + (this.doSut - 4) * 5;
                    if (this.dMax === 40) N_base = 170 + (this.doSut - 4) * 4;
                    if (this.loaiDa === 'soi') N_base -= 10;

                    let N_chuan = this.coPhuGia ? N_base * (1 - this.phanTramGiamNuoc / 100) : N_base;

                    let A = this.loaiDa === 'da_dam' ? 0.60 : 0.55;
                    let A1 = this.loaiDa === 'da_dam' ? 0.38 : 0.33;

                    let X_N = this.rn / (A * this.macXimang) + 0.5;
                    if (X_N > 2.5) X_N = this.rn / (A1 * this.macXimang) - 0.5;

                    let X = X_N * N_chuan;
                    if (X < 250) { X = 250; N_chuan = X / X_N; }

                    let PG = this.coPhuGia ? X * (this.lieuLuongPG / 100) : 0;

                    let V_h = (X / 3.1) + N_chuan + (PG / 1.1);
                    let K_d = 1.25 + (V_h - 280) * 0.001;
                    if (K_d < 1.15) K_d = 1.15;
                    if (K_d > 1.45) K_d = 1.45;

                    let r_d = 1 - (1450 / (2.70 * 1000));
                    let D = 1000 / ((1000 * r_d * K_d / 1450) + (1 / 2.70));
                    let C = (1000 - (X / 3.1 + D / 2.70 + N_chuan / 1.0 + PG / 1.1)) * 2.65;

                    let C_hh = C * (1 + this.wc / 100);
                    let D_hh = D * (1 + this.wd / 100);
                    let N_hh = N_chuan - (C * this.wc / 100) - (D * this.wd / 100);

                    return { X, N_chuan, C, D, PG, C_hh, D_hh, N_hh, X_N };
                },
                vSingleM3() {
                    if (this.selectedKhuon === 'cube15') return 0.15 * 0.15 * 0.15;
                    if (this.selectedKhuon === 'cube10') return 0.10 * 0.10 * 0.10;
                    if (this.selectedKhuon === 'cube20') return 0.20 * 0.20 * 0.20;
                    if (this.selectedKhuon === 'cyl15') return Math.PI * Math.pow(0.075, 2) * 0.30;
                    if (this.selectedKhuon === 'beam15') return 0.15 * 0.15 * 0.60;
                    return 0.15 * 0.15 * 0.15;
                },
                vMeTronLit() {
                    let vSlump = this.coSlumpTest ? 0.008 : 0.0;
                    let totalV = (this.vSingleM3 * this.soLuongMau + vSlump) * this.heSoHaoHut;
                    return totalV * 1000.0;
                },
                vMeTronM3() {
                    return this.vMeTronLit / 1000.0;
                }
            }
        }).mount('#app');
    </script>
</body>
</html>

```

---

## 📌 Các Tính Năng Đã Tích Hợp Trong Mã Nguồn:

1. **Chế độ trộn linh hoạt**:
   - Trạm bê tông tươi tự động ($K = 1.10$).
   - Trộn thủ công công trường ($K = 1.15$).
2. **Tính cấp phối 1 m³**:
   - Xi măng, Nước thực tế, Cát ẩm, Đá ẩm, Phụ gia.
   - Hiệu chỉnh độ ẩm hiện trường ($W_c, W_d$) và lượng nước thực tế ($N_{hh}$).
3. **Mô-đun đúc mẫu thí nghiệm (Trial Batching)**:
   - Các loại khuôn chuẩn: $15\times15\times15\text{ cm}$, $10\times10\times10\text{ cm}$, $20\times20\times20\text{ cm}$, Hình trụ $\Phi 15\times30\text{ cm}$, Dầm uốn $15\times15\times60\text{ cm}$.
   - Tùy chọn cộng thêm 8 Lít cho thử độ sụt (Slump test).
   - Hệ số dính thùng & hao hụt $k = 1.10 \div 1.50$.
   - **Xuất khối lượng chính xác ra GRAM** giúp kỹ thuật viên cân trực tiếp trên đĩa cân phòng LAS-XD.
