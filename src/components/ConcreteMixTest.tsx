import React, { useState, useMemo } from 'react';
import { Settings2, Calculator, Beaker, CheckCircle2, RotateCcw, Layers } from 'lucide-react';

export default function ConcreteMixTest() {
  const [mixMode, setMixMode] = useState<'auto' | 'manual'>('auto');
  const [macBetong, setMacBetong] = useState(250);
  const [macXimang, setMacXimang] = useState(400);
  const [doSut, setDoSut] = useState(8);
  const [dMax, setDMax] = useState(20);
  const [mDl, setMDl] = useState(2.2);
  const [loaiDa, setLoaiDa] = useState<'da_dam' | 'soi'>('da_dam');
  const [coPhuGia, setCoPhuGia] = useState(false);
  const [lieuLuongPG, setLieuLuongPG] = useState(1.0);
  const [phanTramGiamNuoc, setPhanTramGiamNuoc] = useState(12);
  const [wc, setWc] = useState(3.0);
  const [wd, setWd] = useState(1.0);
  const [selectedKhuon, setSelectedKhuon] = useState('cube15');
  const [soLuongMau, setSoLuongMau] = useState(6);
  const [heSoHaoHut, setHeSoHaoHut] = useState(1.20);
  const [coSlumpTest, setCoSlumpTest] = useState(true);

  const handleClear = () => {
    setMixMode('auto');
    setMacBetong(250);
    setMacXimang(400);
    setDoSut(8);
    setDMax(20);
    setMDl(2.2);
    setLoaiDa('da_dam');
    setCoPhuGia(false);
    setLieuLuongPG(1.0);
    setPhanTramGiamNuoc(12);
    setWc(3.0);
    setWd(1.0);
    setSelectedKhuon('cube15');
    setSoLuongMau(6);
    setHeSoHaoHut(1.20);
    setCoSlumpTest(true);
  };

  const { rn, result1m3, vMeTronLit, vMeTronM3 } = useMemo(() => {
    const kFactor = mixMode === 'auto' ? 1.10 : 1.15;
    const rn = macBetong * kFactor;

    let N_base = 185 + (doSut - 4) * 4.5;
    if (dMax === 10) N_base = 200 + (doSut - 4) * 5;
    if (dMax === 40) N_base = 170 + (doSut - 4) * 4;
    if (loaiDa === 'soi') N_base -= 10;

    let N_chuan = coPhuGia ? N_base * (1 - phanTramGiamNuoc / 100) : N_base;

    let A = loaiDa === 'da_dam' ? 0.60 : 0.55;
    let A1 = loaiDa === 'da_dam' ? 0.38 : 0.33;

    let X_N = rn / (A * macXimang) + 0.5;
    if (X_N > 2.5) X_N = rn / (A1 * macXimang) - 0.5;

    let X = X_N * N_chuan;
    if (X < 250) { X = 250; N_chuan = X / X_N; }

    let PG = coPhuGia ? X * (lieuLuongPG / 100) : 0;

    let V_h = (X / 3.1) + N_chuan + (PG / 1.1);
    let K_d = 1.25 + (V_h - 280) * 0.001;
    if (K_d < 1.15) K_d = 1.15;
    if (K_d > 1.45) K_d = 1.45;

    let r_d = 1 - (1450 / (2.70 * 1000));
    let D = 1000 / ((1000 * r_d * K_d / 1450) + (1 / 2.70));
    let C = (1000 - (X / 3.1 + D / 2.70 + N_chuan / 1.0 + PG / 1.1)) * 2.65;

    let C_hh = C * (1 + wc / 100);
    let D_hh = D * (1 + wd / 100);
    let N_hh = N_chuan - (C * wc / 100) - (D * wd / 100);

    const result1m3 = { X, N_chuan, C, D, PG, C_hh, D_hh, N_hh, X_N };

    let vSingleM3 = 0.15 * 0.15 * 0.15;
    if (selectedKhuon === 'cube15') vSingleM3 = 0.15 * 0.15 * 0.15;
    if (selectedKhuon === 'cube10') vSingleM3 = 0.10 * 0.10 * 0.10;
    if (selectedKhuon === 'cube20') vSingleM3 = 0.20 * 0.20 * 0.20;
    if (selectedKhuon === 'cyl15') vSingleM3 = Math.PI * Math.pow(0.075, 2) * 0.30;
    if (selectedKhuon === 'beam15') vSingleM3 = 0.15 * 0.15 * 0.60;

    let vSlump = coSlumpTest ? 0.008 : 0.0;
    let totalV = (vSingleM3 * soLuongMau + vSlump) * heSoHaoHut;
    let vMeTronLit = totalV * 1000.0;
    let vMeTronM3 = vMeTronLit / 1000.0;

    return { rn, result1m3, vMeTronLit, vMeTronM3 };
  }, [
    mixMode, macBetong, macXimang, doSut, dMax, mDl, loaiDa, 
    coPhuGia, lieuLuongPG, phanTramGiamNuoc, wc, wd, 
    selectedKhuon, soLuongMau, heSoHaoHut, coSlumpTest
  ]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Title & Clear Button in mobile, placed above grid */}
      <div className="lg:col-span-12 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Calculator className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Cấp Phối Bê Tông & Đúc Mẫu Thử
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Theo TCVN 10796:2015, TCVN 9382:2012, QĐ 778/1998 & ACI 211.1</p>
        </div>
        <button 
          onClick={handleClear}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded-xl transition-colors font-medium text-sm border border-slate-200 dark:border-slate-700/50"
        >
          <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
        </button>
      </div>

      {/* Sidebar / Inputs Column (5 cols) */}
      <section className="lg:col-span-5 space-y-6">
        {/* Mix Mode */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-4 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Chế Độ Sản Xuất / Trộn
          </h2>
          <div className="space-y-3">
            <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${mixMode === 'auto' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
              <input type="radio" value="auto" checked={mixMode === 'auto'} onChange={(e) => setMixMode(e.target.value as any)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
              <div>
                <span className="font-medium text-slate-800 dark:text-slate-200">Trạm Bê Tông Tươi Tự Động</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hệ số an toàn K = 1.10 (Cân đong chuẩn xác)</p>
              </div>
            </label>

            <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${mixMode === 'manual' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
              <input type="radio" value="manual" checked={mixMode === 'manual'} onChange={(e) => setMixMode(e.target.value as any)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
              <div>
                <span className="font-medium text-slate-800 dark:text-slate-200">Trộn Thủ Công / Công Trường</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hệ số an toàn K = 1.15 (Đong đếm thủ công)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Concrete Specs */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Thông Số Yêu Cầu
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Mác bê tông (M)</label>
              <select value={macBetong} onChange={e => setMacBetong(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                <option value={150}>M150 (B10)</option>
                <option value={200}>M200 (B15)</option>
                <option value={250}>M250 (B20)</option>
                <option value={300}>M300 (B22.5)</option>
                <option value={350}>M350 (B25)</option>
                <option value={400}>M400 (B30)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cường độ Xm Rx</label>
              <select value={macXimang} onChange={e => setMacXimang(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                <option value={30}>PCB 30 (30 MPa)</option>
                <option value={40}>PCB 40 (40 MPa)</option>
                <option value={50}>PC 50 (50 MPa)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Độ sụt yêu cầu (cm)</label>
              <input type="number" value={doSut} onChange={e => setDoSut(Number(e.target.value))} min={2} max={22} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">D_max của đá (mm)</label>
              <select value={dMax} onChange={e => setDMax(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                <option value={10}>10 mm</option>
                <option value={20}>20 mm</option>
                <option value={40}>40 mm</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Mô đun M_đl của cát</label>
              <input type="number" value={mDl} onChange={e => setMDl(Number(e.target.value))} step={0.1} min={0.7} max={3.5} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Loại đá/sỏi</label>
              <select value={loaiDa} onChange={e => setLoaiDa(e.target.value as any)} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="da_dam">Đá dăm (Góc cạnh)</option>
                <option value="soi">Sỏi (Tròn)</option>
              </select>
            </div>
          </div>

          {/* Admixtures & Moisture */}
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <label className="flex items-center space-x-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={coPhuGia} onChange={e => setCoPhuGia(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sử dụng phụ gia dẻo hóa / giảm nước</span>
            </label>
            {coPhuGia && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-300 dark:border-blue-600/50 my-2">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Liều lượng (% XM)</label>
                  <input type="number" value={lieuLuongPG} onChange={e => setLieuLuongPG(Number(e.target.value))} step={0.1} min={0.5} max={2} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">% Giảm nước</label>
                  <input type="number" value={phanTramGiamNuoc} onChange={e => setPhanTramGiamNuoc(Number(e.target.value))} step={1} min={5} max={30} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Độ ẩm Cát Wc (%)</label>
              <input type="number" value={wc} onChange={e => setWc(Number(e.target.value))} step={0.5} min={0} max={10} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Độ ẩm Đá Wd (%)</label>
              <input type="number" value={wd} onChange={e => setWd(Number(e.target.value))} step={0.2} min={0} max={5} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Results Column (7 cols) */}
      <section className="lg:col-span-7 space-y-6">
        {/* Card Kết quả 1m3 */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/50 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Thành Phần Cho 1 m³
            </h2>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 font-semibold px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800/50">
              Rn = {rn.toFixed(1)} MPa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Xi măng</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{result1m3.X.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Nước thực tế</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{result1m3.N_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> Lít</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Cát thực tế</span>
              <span className="text-xl font-bold text-amber-700 dark:text-amber-500">{result1m3.C_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Đá thực tế</span>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{result1m3.D_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 flex justify-between px-1 bg-slate-50 dark:bg-slate-900/30 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50">
            <span>Tỷ lệ N/X: <strong className="text-slate-800 dark:text-slate-200">{(result1m3.N_chuan / result1m3.X).toFixed(2)}</strong></span>
            <span>Phụ gia: <strong className="text-slate-800 dark:text-slate-200">{result1m3.PG.toFixed(2)} kg</strong></span>
          </div>
        </div>

        {/* Card Trộn thử đúc mẫu phòng thí nghiệm */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-amber-200/50 dark:border-amber-700/30 border-l-4 border-l-amber-500">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Tính Toán Trộn Thử Đúc Mẫu Thử
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Loại khuôn đúc mẫu</label>
              <select value={selectedKhuon} onChange={e => setSelectedKhuon(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500">
                <option value="cube15">Khuôn lập phương 15x15x15 cm (3.375 Lít)</option>
                <option value="cube10">Khuôn lập phương 10x10x10 cm (1.000 Lít)</option>
                <option value="cube20">Khuôn lập phương 20x20x20 cm (8.000 Lít)</option>
                <option value="cyl15">Khuôn hình trụ Phi 15x30 cm (5.301 Lít)</option>
                <option value="beam15">Khuôn dầm uốn 15x15x60 cm (13.50 Lít)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Số lượng mẫu</label>
                <input type="number" value={soLuongMau} onChange={e => setSoLuongMau(Number(e.target.value))} min={1} max={30} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Hệ số dính k</label>
                <input type="number" value={heSoHaoHut} onChange={e => setHeSoHaoHut(Number(e.target.value))} step={0.05} min={1.1} max={1.5} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 mb-4 text-sm gap-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={coSlumpTest} onChange={e => setCoSlumpTest(e.target.checked)} className="rounded text-amber-600 w-4 h-4 border-gray-300 focus:ring-amber-500" />
              <span className="text-amber-900 dark:text-amber-200">Tính thêm 8 Lít cho thử độ sụt</span>
            </label>
            <span className="font-bold text-amber-900 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/50 px-3 py-1 rounded-lg">
              Tổng V mẻ = {vMeTronLit.toFixed(2)} Lít
            </span>
          </div>

          {/* Bảng vật liệu cân đong cho phòng thí nghiệm */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
            <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase text-xs font-bold border-b border-slate-200 dark:border-slate-700/50">
                <tr>
                  <th className="p-3 whitespace-nowrap">Vật liệu</th>
                  <th className="p-3 text-right whitespace-nowrap">Khối lượng (Kg)</th>
                  <th className="p-3 text-right whitespace-nowrap bg-slate-200/50 dark:bg-slate-700/50">Khối lượng Cân (Gram)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Xi măng (X)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.X * vMeTronM3).toFixed(3)} kg</td>
                  <td className="p-3 text-right font-bold text-blue-700 dark:text-blue-400 bg-slate-50/50 dark:bg-slate-800/30">{(result1m3.X * vMeTronM3 * 1000).toFixed(1)} g</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Cát thực tế (C_ẩm)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.C_hh * vMeTronM3).toFixed(3)} kg</td>
                  <td className="p-3 text-right font-bold text-amber-700 dark:text-amber-500 bg-slate-50/50 dark:bg-slate-800/30">{(result1m3.C_hh * vMeTronM3 * 1000).toFixed(1)} g</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Đá thực tế (Đ_ẩm)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.D_hh * vMeTronM3).toFixed(3)} kg</td>
                  <td className="p-3 text-right font-bold text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/30">{(result1m3.D_hh * vMeTronM3 * 1000).toFixed(1)} g</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Nước trộn (N_tt)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.N_hh * vMeTronM3).toFixed(3)} Lít</td>
                  <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400 bg-slate-50/50 dark:bg-slate-800/30">{(result1m3.N_hh * vMeTronM3 * 1000).toFixed(1)} ml/g</td>
                </tr>
                {coPhuGia && (
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 bg-blue-50/30 dark:bg-blue-900/10 transition-colors">
                    <td className="p-3 font-medium text-blue-800 dark:text-blue-300">Phụ gia dẻo hóa (PG)</td>
                    <td className="p-3 text-right font-semibold text-blue-800 dark:text-blue-300">{(result1m3.PG * vMeTronM3).toFixed(4)} kg</td>
                    <td className="p-3 text-right font-bold text-indigo-700 dark:text-indigo-400 bg-blue-100/30 dark:bg-blue-800/20">{(result1m3.PG * vMeTronM3 * 1000).toFixed(2)} g</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
