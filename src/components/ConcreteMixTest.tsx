import React, { useState, useMemo } from 'react';
import { Settings2, Calculator, Beaker, RotateCcw, Layers, Printer, FileText } from 'lucide-react';

export default function ConcreteMixTest() {
  const [standard, setStandard] = useState<'QD778' | 'TCVN10796' | 'TCVN9382' | 'ACI211'>('QD778');
  
  // Common
  const [mixMode, setMixMode] = useState<'auto' | 'manual'>('auto');
  const [macBetong, setMacBetong] = useState(250);
  const [doSut, setDoSut] = useState(8);
  const [dMax, setDMax] = useState(20);
  const [loaiDa, setLoaiDa] = useState<'da_dam' | 'soi'>('da_dam');
  const [mDl, setMDl] = useState(2.2);
  const [macXimang, setMacXimang] = useState(400);

  // Admixtures & Moisture
  const [coPhuGia, setCoPhuGia] = useState(false);
  const [lieuLuongPG, setLieuLuongPG] = useState(1.0);
  const [phanTramGiamNuoc, setPhanTramGiamNuoc] = useState(12);
  const [wc, setWc] = useState(3.0);
  const [wd, setWd] = useState(1.0);

  // Densities
  const [rhoX, setRhoX] = useState(3.1);
  const [rhoC, setRhoC] = useState(2.65);
  const [rhoD, setRhoD] = useState(2.70);
  const [rhoVd, setRhoVd] = useState(1450);

  // ACI specific
  const [isAirEntrained, setIsAirEntrained] = useState(false);
  const [rhoDruw, setRhoDruw] = useState(1600);

  // Trial Batch
  const [selectedKhuon, setSelectedKhuon] = useState('cube15');
  const [soLuongMau, setSoLuongMau] = useState(6);
  const [heSoHaoHut, setHeSoHaoHut] = useState(1.20);
  const [coSlumpTest, setCoSlumpTest] = useState(true);

  const handleClear = () => {
    setStandard('QD778');
    setMixMode('auto');
    setMacBetong(250);
    setDoSut(8);
    setDMax(20);
    setLoaiDa('da_dam');
    setMDl(2.2);
    setMacXimang(400);
    setCoPhuGia(false);
    setLieuLuongPG(1.0);
    setPhanTramGiamNuoc(12);
    setWc(3.0);
    setWd(1.0);
    setIsAirEntrained(false);
    setRhoDruw(1600);
    setSelectedKhuon('cube15');
    setSoLuongMau(6);
  };

  const handlePrint = () => {
    window.print();
  };

  const { rn, result1m3, vMeTronLit, vMeTronM3, air } = useMemo(() => {
    let kFactor = mixMode === 'auto' ? 1.10 : 1.15;
    let rn = macBetong * kFactor;

    let X = 0, N_chuan = 0, C = 0, D = 0, PG = 0;
    let X_N = 0, C_hh = 0, D_hh = 0, N_hh = 0;
    let calcAir = 0;

    let A = loaiDa === 'da_dam' ? 0.60 : 0.55;
    let A1 = loaiDa === 'da_dam' ? 0.38 : 0.33;

    let N_base = 185 + (doSut - 4) * 4.5;
    if (dMax === 10) N_base = 200 + (doSut - 4) * 5;
    if (dMax === 40) N_base = 170 + (doSut - 4) * 4;
    if (loaiDa === 'soi') N_base -= 10;

    if (standard === 'QD778') {
      N_chuan = coPhuGia ? N_base * (1 - phanTramGiamNuoc / 100) : N_base;
      X_N = rn / (A * macXimang) + 0.5;
      if (X_N > 2.5) X_N = rn / (A1 * macXimang) - 0.5;
      
      X = X_N * N_chuan;
      if (X < 250) { X = 250; N_chuan = X / X_N; }
      
      PG = coPhuGia ? X * (lieuLuongPG / 100) : 0;
      
      let V_h = (X / rhoX) + N_chuan + (PG / 1.1);
      let K_d = 1.25 + (V_h - 280) * 0.001;
      if (K_d < 1.15) K_d = 1.15;
      if (K_d > 1.45) K_d = 1.45;
      
      let r_d = 1 - (rhoVd / (rhoD * 1000));
      D = 1000 / ((1000 * r_d * K_d / rhoVd) + (1 / rhoD));
      C = (1000 - (X / rhoX + D / rhoD + N_chuan + PG / 1.1)) * rhoC;
    } 
    else if (standard === 'TCVN10796') {
      let km = 0.85 + 0.075 * mDl;
      let Amin = A * km;
      let A1min = A1 * km;

      N_base += 10; // Cát mịn
      N_chuan = coPhuGia ? N_base * (1 - phanTramGiamNuoc / 100) : N_base;
      
      X_N = rn / (Amin * macXimang) + 0.5;
      if (X_N > 2.5) X_N = rn / (A1min * macXimang) - 0.5;
      
      X = X_N * N_chuan;
      if (X < 250) { X = 250; N_chuan = X / X_N; }
      
      PG = coPhuGia ? X * (lieuLuongPG / 100) : 0;
      
      let V_h = (X / rhoX) + N_chuan + (PG / 1.1);
      let K_d = 1.35 + (V_h - 280) * 0.001;
      if (K_d < 1.25) K_d = 1.25;
      
      let r_d = 1 - (rhoVd / (rhoD * 1000));
      D = 1000 / ((1000 * r_d * K_d / rhoVd) + (1 / rhoD));
      C = (1000 - (X / rhoX + D / rhoD + N_chuan + PG / 1.1)) * rhoC;
    }
    else if (standard === 'TCVN9382') {
      N_base += 15; // Cát nghiền
      N_chuan = coPhuGia ? N_base * (1 - phanTramGiamNuoc / 100) : N_base;
      
      X_N = rn / (A * macXimang) + 0.5;
      if (X_N > 2.5) X_N = rn / (A1 * macXimang) - 0.5;
      
      X = X_N * N_chuan;
      if (X < 250) { X = 250; N_chuan = X / X_N; }
      
      PG = coPhuGia ? X * (lieuLuongPG / 100) : 0;
      
      let V_h = (X / rhoX) + N_chuan + (PG / 1.1);
      let K_d = 1.25 + (V_h - 280) * 0.001;
      
      let r_d = 1 - (rhoVd / (rhoD * 1000));
      D = (1000 * rhoVd) / (1000 * r_d * K_d + rhoVd / rhoD);
      C = (1000 - (X / rhoX + D / rhoD + N_chuan + PG / 1.1)) * rhoC;
    }
    else if (standard === 'ACI211') {
      let fcr = macBetong <= 35 ? macBetong + 8.3 : 1.10 * macBetong + 5.0;
      rn = fcr;

      calcAir = isAirEntrained ? 5.0 : 1.5;
      if (dMax === 10) N_base = isAirEntrained ? 180 : 200;
      if (dMax === 20) N_base = isAirEntrained ? 165 : 185;
      if (dMax === 40) N_base = isAirEntrained ? 145 : 160;

      N_chuan = coPhuGia ? N_base * (1 - phanTramGiamNuoc / 100) : N_base;

      let wc_ratio = Math.exp(-0.024 * fcr) * 1.15;
      if (wc_ratio > 0.8) wc_ratio = 0.8;
      
      X = N_chuan / wc_ratio;
      if (X < 250) { X = 250; N_chuan = X * wc_ratio; }
      X_N = 1 / wc_ratio;

      PG = coPhuGia ? X * (lieuLuongPG / 100) : 0;

      let V0 = 0.62;
      if (dMax === 10) V0 = 0.50;
      if (dMax === 40) V0 = 0.71;
      V0 = V0 - (mDl - 2.8) * 0.1;

      D = V0 * rhoDruw;
      
      let Vcat = 1.0 - (X / (rhoX * 1000) + N_chuan / 1000 + D / (rhoD * 1000) + calcAir / 100 + PG / (1.1 * 1000));
      C = Vcat * rhoC * 1000;
    }

    C_hh = C * (1 + wc / 100);
    D_hh = D * (1 + wd / 100);
    N_hh = N_chuan - (C * wc / 100) - (D * wd / 100);

    const result1m3 = { X, N_chuan, C, D, PG, C_hh, D_hh, N_hh, X_N };

    let vSingleM3 = 0.15 * 0.15 * 0.15;
    if (selectedKhuon === 'cube15') vSingleM3 = 0.15 * 0.15 * 0.15;
    if (selectedKhuon === 'cube10') vSingleM3 = 0.10 * 0.10 * 0.10;
    if (selectedKhuon === 'cube20') vSingleM3 = 0.20 * 0.20 * 0.20;
    if (selectedKhuon === 'cyl15') vSingleM3 = Math.PI * Math.pow(0.075, 2) * 0.30;
    if (selectedKhuon === 'cyl10') vSingleM3 = Math.PI * Math.pow(0.05, 2) * 0.20;
    if (selectedKhuon === 'beam15') vSingleM3 = 0.15 * 0.15 * 0.60;
    if (selectedKhuon === 'beam10') vSingleM3 = 0.10 * 0.10 * 0.40;

    let vSlump = coSlumpTest ? 0.008 : 0.0;
    let totalV = (vSingleM3 * soLuongMau + vSlump) * heSoHaoHut;
    let vMeTronLit = totalV * 1000.0;
    let vMeTronM3 = vMeTronLit / 1000.0;

    return { rn, result1m3, vMeTronLit, vMeTronM3, air: calcAir };
  }, [
    standard, mixMode, macBetong, macXimang, doSut, dMax, mDl, loaiDa, 
    coPhuGia, lieuLuongPG, phanTramGiamNuoc, wc, wd, 
    rhoX, rhoC, rhoD, rhoVd, isAirEntrained, rhoDruw,
    selectedKhuon, soLuongMau, heSoHaoHut, coSlumpTest
  ]);

  const standardNames: Record<string, string> = {
    'QD778': 'QĐ 778/1998 (Cát tự nhiên)',
    'TCVN10796': 'TCVN 10796:2015 (Cát mịn)',
    'TCVN9382': 'TCVN 9382:2012 (Cát nghiền)',
    'ACI211': 'ACI 211.1-22 (Tiêu chuẩn Mỹ)'
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans print:p-0 print:block">
      
      {/* Print Only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold uppercase">PHIẾU THIẾT KẾ CẤP PHỐI BÊ TÔNG</h1>
            <p className="text-sm font-semibold">Phòng thí nghiệm chuyên ngành xây dựng LAS-XD 632</p>
          </div>
          <div className="text-right text-sm">
            <p>Ngày tính toán: {new Date().toLocaleDateString('vi-VN')}</p>
            <p>Tiêu chuẩn: <strong>{standardNames[standard]}</strong></p>
          </div>
        </div>
      </div>

      {/* Main UI Header */}
      <div className="lg:col-span-12 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Calculator className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Cấp Phối Bê Tông PRO
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Hệ thống Multi-Standard Edition</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium text-sm shadow-sm"
          >
            <Printer className="w-4 h-4" /> In Phiếu Cấp Phối (PDF)
          </button>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded-xl transition-colors font-medium text-sm border border-slate-200 dark:border-slate-700/50"
          >
            <RotateCcw className="w-4 h-4" /> Khôi phục
          </button>
        </div>
      </div>

      {/* Sidebar / Inputs Column */}
      <section className="lg:col-span-5 space-y-6 print:hidden">
        
        {/* Standard Selection */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Tiêu Chuẩn Tính Toán
          </h2>
          <div className="space-y-2">
            {(Object.keys(standardNames) as Array<keyof typeof standardNames>).map(key => (
              <label key={key} className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${standard === key ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500/50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="radio" value={key} checked={standard === key} onChange={(e) => setStandard(e.target.value as any)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">{standardNames[key]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mix Mode */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-4 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Chế Độ Sản Xuất
          </h2>
          <div className="space-y-3">
            <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${mixMode === 'auto' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
              <input type="radio" value="auto" checked={mixMode === 'auto'} onChange={(e) => setMixMode(e.target.value as any)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <div>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Trạm Tự Động (K=1.10)</span>
              </div>
            </label>
            <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${mixMode === 'manual' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
              <input type="radio" value="manual" checked={mixMode === 'manual'} onChange={(e) => setMixMode(e.target.value as any)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <div>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Thủ Công (K=1.15)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Concrete Specs */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Thông Số Đầu Vào
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {standard === 'ACI211' ? 'Cường độ yêu cầu f\'c (MPa)' : 'Mác bê tông M (MPa)'}
              </label>
              <input type="number" value={macBetong} onChange={e => setMacBetong(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {standard !== 'ACI211' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cường độ XM Rx</label>
                <input type="number" value={macXimang} onChange={e => setMacXimang(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            {standard === 'ACI211' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cuốn khí</label>
                <select value={isAirEntrained ? 'yes' : 'no'} onChange={e => setIsAirEntrained(e.target.value === 'yes')} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="no">Không cuốn khí</option>
                  <option value="yes">Bê tông cuốn khí</option>
                </select>
              </div>
            )}
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
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Mô đun độ lớn Cát</label>
              <input type="number" value={mDl} onChange={e => setMDl(Number(e.target.value))} step={0.1} min={0.7} max={3.5} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              {standard === 'TCVN10796' && mDl > 2.0 && <p className="text-[10px] text-red-500 mt-1">TCVN 10796 yêu cầu cát mịn Mđl 0.7 - 2.0</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Loại cốt liệu lớn</label>
              <select value={loaiDa} onChange={e => setLoaiDa(e.target.value as any)} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="da_dam">Đá dăm (Góc cạnh)</option>
                <option value="soi">Sỏi (Tròn)</option>
              </select>
            </div>
          </div>

          {standard === 'ACI211' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">KLTT đầm chặt Đá (DRUW)</label>
                <input type="number" value={rhoDruw} onChange={e => setRhoDruw(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {/* Admixtures */}
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <label className="flex items-center space-x-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={coPhuGia} onChange={e => setCoPhuGia(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phụ gia dẻo hóa / giảm nước</span>
            </label>
            {coPhuGia && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-300 dark:border-blue-600/50 my-2">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Liều lượng (% XM)</label>
                  <input type="number" value={lieuLuongPG} onChange={e => setLieuLuongPG(Number(e.target.value))} step={0.1} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">% Giảm nước</label>
                  <input type="number" value={phanTramGiamNuoc} onChange={e => setPhanTramGiamNuoc(Number(e.target.value))} step={1} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Độ ẩm Cát Wc (%)</label>
              <input type="number" value={wc} onChange={e => setWc(Number(e.target.value))} step={0.5} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Độ ẩm Đá Wd (%)</label>
              <input type="number" value={wd} onChange={e => setWd(Number(e.target.value))} step={0.2} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Results Column */}
      <section className="lg:col-span-7 space-y-6 print:col-span-12 print:space-y-4">
        {/* Card Kết quả 1m3 */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/50 dark:border-slate-700/50 print:bg-white print:border-slate-300 print:shadow-none print:break-inside-avoid">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 print:text-black">
              <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400 print:hidden" /> 
              Thành Phần Cấp Phối 1 m³
            </h2>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 font-semibold px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800/50 print:border-black print:text-black print:bg-transparent">
              {standard === 'ACI211' ? `f'cr = ${rn.toFixed(1)} MPa` : `Rn = ${rn.toFixed(1)} MPa`}
            </span>
          </div>

          {standard === 'ACI211' && air > 0 && (
            <p className="text-xs mb-3 text-slate-500 italic">Lượng khí cuốn tính toán: {air}%</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 print:gap-1">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Xi măng</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100 print:text-black">{result1m3.X.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Nước (Hiện trường)</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 print:text-black">{result1m3.N_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> Lít</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Cát (Hiện trường)</span>
              <span className="text-xl font-bold text-amber-700 dark:text-amber-500 print:text-black">{result1m3.C_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Đá (Hiện trường)</span>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300 print:text-black">{result1m3.D_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 flex justify-between px-2 bg-slate-50 dark:bg-slate-900/30 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50 print:bg-transparent print:border-slate-300">
            <span>Tỷ lệ {standard === 'ACI211' ? 'w/cm' : 'N/X'}: <strong className="text-slate-800 dark:text-slate-200 print:text-black">{(result1m3.N_chuan / result1m3.X).toFixed(2)}</strong></span>
            <span>Nước (Khô): <strong className="text-slate-800 dark:text-slate-200 print:text-black">{result1m3.N_chuan.toFixed(1)} Lít</strong></span>
            <span>Phụ gia: <strong className="text-slate-800 dark:text-slate-200 print:text-black">{result1m3.PG.toFixed(2)} kg</strong></span>
          </div>
        </div>

        {/* Card Trộn thử đúc mẫu phòng thí nghiệm */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-amber-200/50 dark:border-amber-700/30 border-l-4 border-l-amber-500 print:bg-white print:border-slate-300 print:border-l-4 print:border-l-black print:shadow-none print:break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 print:text-black">
            <Beaker className="w-5 h-5 text-amber-600 dark:text-amber-400 print:hidden" /> Tính Toán Mẻ Trộn Phòng Thí Nghiệm
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 print:hidden">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Loại khuôn đúc mẫu</label>
              <select value={selectedKhuon} onChange={e => setSelectedKhuon(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500">
                <option value="cube15">Khuôn lập phương 15x15x15 cm (3.375 Lít)</option>
                <option value="cube10">Khuôn lập phương 10x10x10 cm (1.000 Lít)</option>
                <option value="cube20">Khuôn lập phương 20x20x20 cm (8.000 Lít)</option>
                <option value="cyl15">Khuôn hình trụ Phi 15x30 cm (5.301 Lít)</option>
                <option value="cyl10">Khuôn hình trụ Phi 10x20 cm (1.571 Lít)</option>
                <option value="beam15">Khuôn dầm uốn 15x15x60 cm (13.50 Lít)</option>
                <option value="beam10">Khuôn dầm uốn 10x10x40 cm (4.00 Lít)</option>
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 mb-4 text-sm gap-2 print:bg-transparent print:border-slate-300">
            <label className="flex items-center space-x-2 cursor-pointer print:hidden">
              <input type="checkbox" checked={coSlumpTest} onChange={e => setCoSlumpTest(e.target.checked)} className="rounded text-amber-600 w-4 h-4 border-gray-300 focus:ring-amber-500" />
              <span className="text-amber-900 dark:text-amber-200">Tính thêm 8 Lít thử độ sụt</span>
            </label>
            <div className="hidden print:block font-medium">Đúc {soLuongMau} mẫu ({selectedKhuon}) {coSlumpTest ? '+ Thử độ sụt' : ''}</div>
            <span className="font-bold text-amber-900 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/50 px-3 py-1 rounded-lg print:text-black print:bg-transparent print:border print:border-black">
              Tổng V mẻ = {vMeTronLit.toFixed(2)} Lít
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50 print:border-black">
            <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300 print:text-black">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase text-xs font-bold border-b border-slate-200 dark:border-slate-700/50 print:bg-transparent print:border-black print:text-black">
                <tr>
                  <th className="p-3 whitespace-nowrap">Vật liệu</th>
                  <th className="p-3 text-right whitespace-nowrap">Khối lượng (Kg)</th>
                  <th className="p-3 text-right whitespace-nowrap bg-slate-200/50 dark:bg-slate-700/50 print:bg-transparent">Cân Đong (Gram)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 print:divide-black">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Xi măng (X)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.X * vMeTronM3).toFixed(3)} kg</td>
                  <td className="p-3 text-right font-bold text-blue-700 dark:text-blue-400 bg-slate-50/50 dark:bg-slate-800/30 print:text-black print:bg-transparent">{(result1m3.X * vMeTronM3 * 1000).toFixed(1)} g</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Cát thực tế (C_ẩm)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.C_hh * vMeTronM3).toFixed(3)} kg</td>
                  <td className="p-3 text-right font-bold text-amber-700 dark:text-amber-500 bg-slate-50/50 dark:bg-slate-800/30 print:text-black print:bg-transparent">{(result1m3.C_hh * vMeTronM3 * 1000).toFixed(1)} g</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Đá thực tế (Đ_ẩm)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.D_hh * vMeTronM3).toFixed(3)} kg</td>
                  <td className="p-3 text-right font-bold text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/30 print:text-black print:bg-transparent">{(result1m3.D_hh * vMeTronM3 * 1000).toFixed(1)} g</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">Nước trộn (N_tt)</td>
                  <td className="p-3 text-right font-semibold">{(result1m3.N_hh * vMeTronM3).toFixed(3)} Lít</td>
                  <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400 bg-slate-50/50 dark:bg-slate-800/30 print:text-black print:bg-transparent">{(result1m3.N_hh * vMeTronM3 * 1000).toFixed(1)} ml/g</td>
                </tr>
                {coPhuGia && (
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 bg-blue-50/30 dark:bg-blue-900/10 transition-colors print:bg-transparent">
                    <td className="p-3 font-medium text-blue-800 dark:text-blue-300 print:text-black">Phụ gia dẻo hóa (PG)</td>
                    <td className="p-3 text-right font-semibold text-blue-800 dark:text-blue-300 print:text-black">{(result1m3.PG * vMeTronM3).toFixed(4)} kg</td>
                    <td className="p-3 text-right font-bold text-indigo-700 dark:text-indigo-400 bg-blue-100/30 dark:bg-blue-800/20 print:text-black print:bg-transparent">{(result1m3.PG * vMeTronM3 * 1000).toFixed(2)} g</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Only Signatures */}
        <div className="hidden print:flex justify-between mt-16 text-center text-sm">
          <div>
            <p className="font-bold mb-16">NGƯỜI LẬP</p>
            <p>.......................................</p>
          </div>
          <div>
            <p className="font-bold mb-16">TRƯỞNG PHÒNG LAS-XD</p>
            <p>.......................................</p>
          </div>
        </div>

      </section>
    </div>
  );
}
