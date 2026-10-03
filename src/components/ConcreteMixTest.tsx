import React, { useState, useMemo } from 'react';
import { Settings2, Calculator, Beaker, RotateCcw, Layers, Printer, FileText, ClipboardCheck } from 'lucide-react';

export default function ConcreteMixTest() {
  const [standard, setStandard] = useState<'QD778' | 'TCVN10796' | 'TCVN9382' | 'ACI211'>('QD778');
  
  // Common
  const [mixMode, setMixMode] = useState<'auto' | 'manual'>('auto');
  const [macBetong, setMacBetong] = useState(250); 
  const [fcAci, setFcAci] = useState(30); // f'c cho ACI (MPa)
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

  // Densities (Common)
  const [rhoX, setRhoX] = useState(3.1);
  const [rhoC, setRhoC] = useState(2.65);
  const [rhoD, setRhoD] = useState(2.70);
  const [rhoVd, setRhoVd] = useState(42);

  // States cho Cấp phối thủ công
  const [gammaCat, setGammaCat] = useState(1450); // Khối lượng thể tích xốp Cát kg/m3
  const [gammaDa, setGammaDa] = useState(1500);   // Khối lượng thể tích xốp Đá kg/m3
  const [dungTichThung, setDungTichThung] = useState(18); // Thùng bê 18 lít

  // --- TCVN 10796 (Cát mịn) ---
  const [wHutCat, setWHutCat] = useState(2.0); // 1.5 - 3.5%
  const [isSandBlending, setIsSandBlending] = useState(false);
  const [blendSandType, setBlendSandType] = useState<'tho' | 'nghien'>('tho');
  const [blendSandRatio, setBlendSandRatio] = useState(30);

  // --- TCVN 9382 (Cát nghiền) ---
  const [botDa, setBotDa] = useState(10); // 5 - 15%
  const [hatDet, setHatDet] = useState(15); // <= 20%
  const [rc, setRc] = useState(42); // 38 - 45%
  const [hinhDang, setHinhDang] = useState<'sac_canh' | 'bo_tron' | 'hon_hop'>('sac_canh');
  const [blendTuNhien, setBlendTuNhien] = useState(false);
  const [blendTuNhienRatio, setBlendTuNhienRatio] = useState(20);

  // --- ACI 211.1-22 ---
  const [isAirEntrained, setIsAirEntrained] = useState(false);
  const [exposure, setExposure] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [rhoDruw, setRhoDruw] = useState(1600);
  const [sgCement, setSgCement] = useState(3.15);
  const [sgCoarse, setSgCoarse] = useState(2.68);
  const [sgFine, setSgFine] = useState(2.60);
  const [fm, setFm] = useState(2.60);
  const [hasScm, setHasScm] = useState(false);
  const [scmType, setScmType] = useState<'flyash' | 'slag' | 'silica'>('flyash');
  const [scmRatio, setScmRatio] = useState(20);
  const [sgScm, setSgScm] = useState(2.2);

  // Trial Batch
  const [selectedKhuon, setSelectedKhuon] = useState('cube15');
  const [soLuongMau, setSoLuongMau] = useState(6);
  const [heSoHaoHut, setHeSoHaoHut] = useState(1.20);
  const [coSlumpTest, setCoSlumpTest] = useState(true);

  const handleClear = () => {
    setStandard('QD778');
    setMixMode('auto');
    setMacBetong(250);
    setFcAci(30);
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
    setExposure('mild');
    setRhoDruw(1600);
    setSelectedKhuon('cube15');
    setSoLuongMau(6);
  };

  const { rn, result1m3, vMeTronLit, vMeTronM3, air, errors, bucket50kg } = useMemo(() => {
    let kFactor = mixMode === 'auto' ? 1.10 : 1.15;
    let rn = macBetong * kFactor;
    let errorList: string[] = [];

    let X = 0, N_chuan = 0, C = 0, D = 0, PG = 0, SCM = 0;
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
      let finalMDl = mDl;
      if (isSandBlending) {
        let blendMDl = blendSandType === 'tho' ? 2.8 : 3.0; // giả định
        finalMDl = (mDl * (100 - blendSandRatio) + blendMDl * blendSandRatio) / 100;
      }

      if (finalMDl >= 0.7 && finalMDl <= 1.0 && macBetong > 200) {
        errorList.push('Mđl 0.7-1.0 chỉ dùng cho bê tông mác <= M200 (B15).');
      } else if (finalMDl > 1.0 && finalMDl <= 1.2 && macBetong > 300) {
        errorList.push('Mđl 1.1-1.2 chỉ dùng cho bê tông mác <= M300 (B25).');
      }

      let km = 0.85 + 0.075 * finalMDl;
      let Amin = A * km;
      let A1min = A1 * km;

      N_base += 10; // Cát mịn tăng nước
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
      if (botDa > 10 && macBetong > 400) {
        errorList.push('Mác > B30 (M400) yêu cầu hạt mịn (bột đá) <= 10%.');
      }
      
      let addWater = hinhDang === 'sac_canh' ? 15 : (hinhDang === 'bo_tron' ? 5 : 10);
      N_base += addWater;
      
      N_chuan = coPhuGia ? N_base * (1 - phanTramGiamNuoc / 100) : N_base;
      
      X_N = rn / (A * macXimang) + 0.5;
      if (X_N > 2.5) X_N = rn / (A1 * macXimang) - 0.5;
      
      X = X_N * N_chuan;
      if (X < 250) { X = 250; N_chuan = X / X_N; }
      
      PG = coPhuGia ? X * (lieuLuongPG / 100) : 0;
      
      let V_h = (X / rhoX) + N_chuan + (PG / 1.1);
      let K_d = 1.25 + (V_h - 280) * 0.001; // Cát nghiền K_d
      
      let r_d = 1 - (rhoVd / (rhoD * 1000));
      D = (1000 * rhoVd) / (1000 * r_d * K_d + rhoVd / rhoD);
      C = (1000 - (X / rhoX + D / rhoD + N_chuan + PG / 1.1)) * rhoC;
    }
    else if (standard === 'ACI211') {
      let fcr = fcAci <= 35 ? fcAci + 8.3 : 1.10 * fcAci + 5.0;
      rn = fcr;

      calcAir = isAirEntrained ? (exposure === 'severe' ? 6.0 : (exposure === 'moderate' ? 4.5 : 3.0)) : 1.5;
      
      if (dMax === 10) N_base = isAirEntrained ? 180 : 205;
      else if (dMax === 20) N_base = isAirEntrained ? 165 : 185;
      else if (dMax === 40) N_base = isAirEntrained ? 145 : 160;
      else N_base = 185;

      N_chuan = coPhuGia ? N_base * (1 - phanTramGiamNuoc / 100) : N_base;

      let wc_ratio = Math.exp(-0.024 * fcr) * 1.15;
      
      // Exposure limits
      if (exposure === 'severe' && wc_ratio > 0.45) {
        wc_ratio = 0.45;
        errorList.push('Môi trường Severe: w/cm bị khống chế <= 0.45');
      } else if (exposure === 'moderate' && wc_ratio > 0.50) {
        wc_ratio = 0.50;
        errorList.push('Môi trường Moderate: w/cm bị khống chế <= 0.50');
      }
      
      let CM_Total = N_chuan / wc_ratio;
      X_N = 1 / wc_ratio;

      if (hasScm) {
        SCM = CM_Total * (scmRatio / 100);
        X = CM_Total - SCM;
      } else {
        X = CM_Total;
      }

      PG = coPhuGia ? CM_Total * (lieuLuongPG / 100) : 0;

      let V0 = 0.62;
      if (dMax === 10) V0 = 0.50;
      if (dMax === 40) V0 = 0.71;
      V0 = V0 - (fm - 2.8) * 0.1;

      D = V0 * rhoDruw;
      
      let VCement = X / (sgCement * 1000);
      let VScm = hasScm ? SCM / (sgScm * 1000) : 0;
      let VWater = N_chuan / 1000;
      let VCoarse = D / (sgCoarse * 1000);
      let VAir = calcAir / 100;
      let VPg = PG / (1.1 * 1000);
      
      let Vcat = 1.0 - (VCement + VScm + VWater + VCoarse + VAir + VPg);
      if(Vcat < 0) Vcat = 0.1; // fallback
      C = Vcat * sgFine * 1000;
    }

    C_hh = C * (1 + wc / 100);
    D_hh = D * (1 + wd / 100);
    N_hh = N_chuan - (C * wc / 100) - (D * wd / 100);

    let C1_hh = 0, C2_hh = 0;
    if (isSandBlending) {
      let r1 = blendSandRatio / 100;
      let r2 = 1 - r1;
      C1_hh = C * r1 * (1 + wc / 100);
      C2_hh = C * r2 * (1 + wc / 100);
    }

    const result1m3 = { X, N_chuan, C, D, PG, SCM, C_hh, D_hh, N_hh, X_N, C1_hh, C2_hh };

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

    // Tính toán cấp phối 1 bao xi măng (50kg)
    const k_50kg = 50 / X;
    const bucket50kg = {
      xiMang: 1, // 1 bao
      catLiters: (C_hh * k_50kg / gammaCat) * 1000,
      daLiters: (D_hh * k_50kg / gammaDa) * 1000,
      nuocLiters: N_hh * k_50kg,
      catThung: ((C_hh * k_50kg / gammaCat) * 1000) / dungTichThung,
      daThung: ((D_hh * k_50kg / gammaDa) * 1000) / dungTichThung,
      nuocThung: (N_hh * k_50kg) / dungTichThung,
      // For blend (if C1_hh is present)
      cat1Thung: (isSandBlending && result1m3.C1_hh) ? ((result1m3.C1_hh * k_50kg / gammaCat) * 1000) / dungTichThung : 0,
      cat2Thung: (isSandBlending && result1m3.C2_hh) ? ((result1m3.C2_hh * k_50kg / gammaCat) * 1000) / dungTichThung : 0,
    };

    return { rn, result1m3, vMeTronLit, vMeTronM3, air: calcAir, errors: errorList, bucket50kg };
  }, [
    standard, mixMode, macBetong, fcAci, macXimang, doSut, dMax, mDl, loaiDa, 
    coPhuGia, lieuLuongPG, phanTramGiamNuoc, wc, wd, 
    rhoX, rhoC, rhoD, rhoVd, 
    wHutCat, isSandBlending, blendSandType, blendSandRatio,
    botDa, hatDet, rc, hinhDang, blendTuNhien, blendTuNhienRatio,
    isAirEntrained, exposure, rhoDruw, sgCement, sgCoarse, sgFine, fm, hasScm, scmType, scmRatio, sgScm,
    selectedKhuon, soLuongMau, heSoHaoHut, coSlumpTest,
    gammaCat, gammaDa, dungTichThung
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
            Cấp Phối Bê Tông PRO V3
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Hệ thống Multi-Standard Edition</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium text-sm shadow-sm"
          >
            <Printer className="w-4 h-4" /> In Phiếu Cấp Phối
          </button>
        </div>
      </div>

      {/* Errors display */}
      {errors.length > 0 && (
        <div className="lg:col-span-12 print:hidden">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="text-red-800 dark:text-red-300 font-bold mb-2">Cảnh báo Tiêu Chuẩn:</h3>
            <ul className="list-disc pl-5 text-red-700 dark:text-red-400 text-sm">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

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
        {standard !== 'ACI211' && (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Chế Độ Sản Xuất
            </h2>
            <div className="space-y-3">
              <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${mixMode === 'auto' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="radio" value="auto" checked={mixMode === 'auto'} onChange={(e) => setMixMode(e.target.value as any)} className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Trạm Tự Động (K=1.10)</span>
              </label>
              <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${mixMode === 'manual' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="radio" value="manual" checked={mixMode === 'manual'} onChange={(e) => setMixMode(e.target.value as any)} className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Thủ Công (K=1.15)</span>
              </label>
            </div>
          </div>
        )}

        {/* General Specs */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Thông Số Cơ Bản
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {standard === 'ACI211' ? 'Cường độ nén f\'c (MPa)' : 'Mác bê tông M (MPa)'}
              </label>
              {standard === 'ACI211' ? (
                <input type="number" value={fcAci} onChange={e => setFcAci(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 outline-none text-sm text-slate-800 dark:text-slate-200" />
              ) : (
                <input type="number" value={macBetong} onChange={e => setMacBetong(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 outline-none text-sm text-slate-800 dark:text-slate-200" />
              )}
            </div>
            {standard !== 'ACI211' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cường độ XM Rx</label>
                <input type="number" value={macXimang} onChange={e => setMacXimang(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 outline-none text-sm text-slate-800 dark:text-slate-200" />
              </div>
            )}
            {standard === 'ACI211' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Môi trường</label>
                <select value={exposure} onChange={e => setExposure(e.target.value as any)} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 outline-none text-sm text-slate-800 dark:text-slate-200">
                  <option value="mild">Mild (Thường)</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe (Nặng)</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Độ sụt yêu cầu (cm)</label>
              <input type="number" value={doSut} onChange={e => setDoSut(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 outline-none text-sm text-slate-800 dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">D_max của đá (mm)</label>
              <select value={dMax} onChange={e => setDMax(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 outline-none text-sm text-slate-800 dark:text-slate-200">
                <option value={10}>10 mm</option>
                <option value={20}>20 mm</option>
                <option value={40}>40 mm</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC FORMS BY STANDARD */}
          
          {/* TCVN 10796 */}
          {standard === 'TCVN10796' && (
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-3 mt-4">
              <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Thông số Cát mịn (TCVN 10796)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-indigo-600 dark:text-indigo-300">Mđl cát mịn (0.7-2.0)</label>
                  <input type="number" value={mDl} onChange={e => setMDl(Number(e.target.value))} step={0.1} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm border-indigo-200 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-indigo-600 dark:text-indigo-300">Độ hút nước (%)</label>
                  <input type="number" value={wHutCat} onChange={e => setWHutCat(Number(e.target.value))} step={0.1} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm border-indigo-200 text-slate-800 dark:text-slate-200" />
                </div>
              </div>
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={isSandBlending} onChange={e => setIsSandBlending(e.target.checked)} className="rounded" />
                <span className="text-slate-800 dark:text-slate-200">Phối hợp thêm cát khác</span>
              </label>
              {isSandBlending && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-indigo-600 dark:text-indigo-300">Loại cát phối</label>
                    <select value={blendSandType} onChange={e => setBlendSandType(e.target.value as any)} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200">
                      <option value="tho">Cát thô</option>
                      <option value="nghien">Cát nghiền</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-indigo-600 dark:text-indigo-300">% Cát phối</label>
                    <input type="number" value={blendSandRatio} onChange={e => setBlendSandRatio(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TCVN 9382 */}
          {standard === 'TCVN9382' && (
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-3 mt-4">
              <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Thông số Cát nghiền (TCVN 9382)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-emerald-600 dark:text-emerald-400">Hàm lượng bột đá (%)</label>
                  <input type="number" value={botDa} onChange={e => setBotDa(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-emerald-600 dark:text-emerald-400">Hạt dẹt (%)</label>
                  <input type="number" value={hatDet} onChange={e => setHatDet(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-emerald-600 dark:text-emerald-400">Độ rỗng xốp rc (%)</label>
                  <input type="number" value={rc} onChange={e => setRc(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-emerald-600 dark:text-emerald-400">Hình dạng hạt</label>
                  <select value={hinhDang} onChange={e => setHinhDang(e.target.value as any)} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200">
                    <option value="sac_canh">Sắc cạnh</option>
                    <option value="bo_tron">Bo tròn</option>
                    <option value="hon_hop">Hỗn hợp</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ACI 211 */}
          {standard === 'ACI211' && (
            <div className="p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl space-y-3 mt-4">
              <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Thông số ACI 211.1-22</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-red-600 dark:text-red-400">Cuốn khí</label>
                  <select value={isAirEntrained ? 'yes' : 'no'} onChange={e => setIsAirEntrained(e.target.value === 'yes')} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200">
                    <option value="no">Không</option>
                    <option value="yes">Có (Air-entrained)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-red-600 dark:text-red-400">DRUW Đá (kg/m3)</label>
                  <input type="number" value={rhoDruw} onChange={e => setRhoDruw(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-red-600 dark:text-red-400">SG Cát (Fine)</label>
                  <input type="number" value={sgFine} onChange={e => setSgFine(Number(e.target.value))} step={0.01} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-red-600 dark:text-red-400">SG Đá (Coarse)</label>
                  <input type="number" value={sgCoarse} onChange={e => setSgCoarse(Number(e.target.value))} step={0.01} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-red-600 dark:text-red-400">SG Xi măng</label>
                  <input type="number" value={sgCement} onChange={e => setSgCement(Number(e.target.value))} step={0.01} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs text-red-600 dark:text-red-400">FM Cát (Fineness Modulus)</label>
                  <input type="number" value={fm} onChange={e => setFm(Number(e.target.value))} step={0.1} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                </div>
              </div>

              <label className="flex items-center space-x-2 text-sm mt-2">
                <input type="checkbox" checked={hasScm} onChange={e => setHasScm(e.target.checked)} className="rounded" />
                <span className="text-slate-800 dark:text-slate-200">Dùng SCMs (Tro bay, Xỉ, Silica Fume)</span>
              </label>
              {hasScm && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-xs text-red-600 dark:text-red-400">% Thay thế</label>
                    <input type="number" value={scmRatio} onChange={e => setScmRatio(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs text-red-600 dark:text-red-400">SG của SCM</label>
                    <input type="number" value={sgScm} onChange={e => setSgScm(Number(e.target.value))} step={0.1} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200" />
                  </div>
                </div>
              )}
            </div>
          )}

          {standard === 'QD778' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Mô đun độ lớn Cát (Mđl)</label>
                <input type="number" value={mDl} onChange={e => setMDl(Number(e.target.value))} step={0.1} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Loại cốt liệu lớn</label>
                <select value={loaiDa} onChange={e => setLoaiDa(e.target.value as any)} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 text-sm">
                  <option value="da_dam">Đá dăm (Góc cạnh)</option>
                  <option value="soi">Sỏi (Tròn)</option>
                </select>
              </div>
            </div>
          )}

          {/* Admixtures */}
          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <label className="flex items-center space-x-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={coPhuGia} onChange={e => setCoPhuGia(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phụ gia dẻo hóa / giảm nước</span>
            </label>
            {coPhuGia && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-300 dark:border-blue-600/50 my-2">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Liều lượng (% XM)</label>
                  <input type="number" value={lieuLuongPG} onChange={e => setLieuLuongPG(Number(e.target.value))} step={0.1} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">% Giảm nước</label>
                  <input type="number" value={phanTramGiamNuoc} onChange={e => setPhanTramGiamNuoc(Number(e.target.value))} step={1} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2 text-sm" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Độ ẩm Cát Wc (%)</label>
              <input type="number" value={wc} onChange={e => setWc(Number(e.target.value))} step={0.5} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Độ ẩm Đá Wd (%)</label>
              <input type="number" value={wd} onChange={e => setWd(Number(e.target.value))} step={0.2} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2 text-sm" />
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
            <p className="text-xs mb-3 text-slate-500 italic">Lượng khí cuốn tính toán: {air.toFixed(1)}%</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 print:gap-1">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Xi măng</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100 print:text-black">{result1m3.X.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Nước (HT)</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 print:text-black">{result1m3.N_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> Lít</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Cát (HT)</span>
              <span className="text-xl font-bold text-amber-700 dark:text-amber-500 print:text-black">{result1m3.C_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center print:border-slate-400 print:bg-transparent">
              <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-medium">Đá (HT)</span>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300 print:text-black">{result1m3.D_hh.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> kg</span>
            </div>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 flex justify-between px-2 bg-slate-50 dark:bg-slate-900/30 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50 print:bg-transparent print:border-slate-300">
            <span>Tỷ lệ {standard === 'ACI211' ? 'w/cm' : 'N/X'}: <strong className="text-slate-800 dark:text-slate-200 print:text-black">{(result1m3.N_chuan / (result1m3.X + result1m3.SCM)).toFixed(2)}</strong></span>
            <span>Nước (Khô): <strong className="text-slate-800 dark:text-slate-200 print:text-black">{result1m3.N_chuan.toFixed(1)} Lít</strong></span>
            <span>Phụ gia: <strong className="text-slate-800 dark:text-slate-200 print:text-black">{result1m3.PG.toFixed(2)} kg</strong></span>
            {hasScm && <span>SCM: <strong className="text-slate-800 dark:text-slate-200 print:text-black">{result1m3.SCM.toFixed(1)} kg</strong></span>}
          </div>
        </div>

        {/* Card Trộn thử đúc mẫu phòng thí nghiệm */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-amber-200/50 dark:border-amber-700/30 border-l-4 border-l-amber-500 print:bg-white print:border-slate-300 print:border-l-4 print:border-l-black print:shadow-none print:break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 print:text-black mb-4">
            <Beaker className="w-5 h-5 text-amber-600 dark:text-amber-400 print:hidden" /> Mẻ Trộn Phòng Thí Nghiệm
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 print:hidden">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Loại khuôn đúc mẫu</label>
              <select value={selectedKhuon} onChange={e => setSelectedKhuon(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 text-sm">
                <option value="cube15">Lập phương 15x15x15 cm (3.375 L)</option>
                <option value="cube10">Lập phương 10x10x10 cm (1.000 L)</option>
                <option value="cube20">Lập phương 20x20x20 cm (8.000 L)</option>
                <option value="cyl15">Hình trụ Phi 15x30 cm (5.301 L)</option>
                <option value="cyl10">Hình trụ Phi 10x20 cm (1.571 L)</option>
                <option value="beam15">Dầm uốn 15x15x60 cm (13.50 L)</option>
                <option value="beam10">Dầm uốn 10x10x40 cm (4.00 L)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Số lượng mẫu</label>
                <input type="number" value={soLuongMau} onChange={e => setSoLuongMau(Number(e.target.value))} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Hệ số hao hụt k</label>
                <input type="number" value={heSoHaoHut} onChange={e => setHeSoHaoHut(Number(e.target.value))} step={0.05} className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 text-sm" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 mb-4 text-sm gap-2 print:bg-transparent print:border-slate-300">
            <label className="flex items-center space-x-2 cursor-pointer print:hidden">
              <input type="checkbox" checked={coSlumpTest} onChange={e => setCoSlumpTest(e.target.checked)} className="rounded text-amber-600" />
              <span className="text-amber-900 dark:text-amber-200">Tính thêm 8 Lít thử độ sụt</span>
            </label>
            <div className="hidden print:block font-medium">Đúc {soLuongMau} mẫu ({selectedKhuon}) {coSlumpTest ? '+ Thử độ sụt' : ''}</div>
            <span className="font-bold text-amber-900 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/50 px-3 py-1 rounded-lg print:text-black print:bg-transparent print:border print:border-black">
              Tổng V mẻ = {vMeTronLit.toFixed(2)} Lít
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50 print:border-black">
            <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300 print:text-black">
              <thead className="bg-slate-100 dark:bg-slate-800/80 uppercase text-xs font-bold border-b border-slate-200 dark:border-slate-700/50 print:bg-transparent print:border-black print:text-black">
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
                {hasScm && (
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-medium text-teal-700 dark:text-teal-400">Chất độn SCMs</td>
                    <td className="p-3 text-right font-semibold text-teal-700 dark:text-teal-400">{(result1m3.SCM * vMeTronM3).toFixed(3)} kg</td>
                    <td className="p-3 text-right font-bold text-teal-700 dark:text-teal-400 bg-slate-50/50 dark:bg-slate-800/30 print:text-black print:bg-transparent">{(result1m3.SCM * vMeTronM3 * 1000).toFixed(1)} g</td>
                  </tr>
                )}
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
                  <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400 bg-slate-50/50 dark:bg-slate-800/30 print:text-black print:bg-transparent">{(result1m3.N_hh * vMeTronM3 * 1000).toFixed(1)} g</td>
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

        {/* 1 Bao 50kg Section */}
        <div className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl mt-6 relative overflow-hidden print:hidden">
          <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 relative z-10 text-cyan-200">
            <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            QUY ĐỔI TRỘN THỦ CÔNG (1 BAO XI MĂNG 50KG)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 relative z-10">
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <label className="block text-[11px] text-cyan-200 mb-1">KLTT Xốp Cát (kg/m³)</label>
              <input type="number" value={gammaCat} onChange={e => setGammaCat(Number(e.target.value))} className="w-full bg-transparent border-b border-white/30 text-white p-1 text-sm outline-none focus:border-cyan-400" />
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <label className="block text-[11px] text-cyan-200 mb-1">KLTT Xốp Đá (kg/m³)</label>
              <input type="number" value={gammaDa} onChange={e => setGammaDa(Number(e.target.value))} className="w-full bg-transparent border-b border-white/30 text-white p-1 text-sm outline-none focus:border-cyan-400" />
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <label className="block text-[11px] text-cyan-200 mb-1">Dung tích thùng (Lít)</label>
              <input type="number" value={dungTichThung} onChange={e => setDungTichThung(Number(e.target.value))} className="w-full bg-transparent border-b border-white/30 text-white p-1 text-sm outline-none focus:border-cyan-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
            <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20 backdrop-blur-sm text-center">
              <p className="text-xs text-cyan-200 mb-1 font-medium">Xi Măng</p>
              <p className="text-lg sm:text-xl font-bold">1 <span className="text-xs font-normal">bao</span></p>
            </div>
            
            {!isSandBlending ? (
              <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20 backdrop-blur-sm text-center">
                <p className="text-xs text-cyan-200 mb-1 font-medium">Cát</p>
                <p className="text-lg sm:text-xl font-bold">{bucket50kg.catThung.toFixed(2)} <span className="text-xs font-normal">thùng</span></p>
                <p className="text-[10px] text-cyan-100/70 mt-1">~ {bucket50kg.catLiters.toFixed(1)} lít</p>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20 backdrop-blur-sm text-center">
                <p className="text-xs text-cyan-200 mb-1 font-medium">Cát (Nghiền + Mịn)</p>
                <p className="text-base sm:text-lg font-bold">{bucket50kg.cat1Thung.toFixed(2)} <span className="text-xs font-normal">+</span> {bucket50kg.cat2Thung.toFixed(2)} <span className="text-[10px] font-normal">thùng</span></p>
                <p className="text-[10px] text-cyan-100/70 mt-1">~ {bucket50kg.catLiters.toFixed(1)} lít tổng</p>
              </div>
            )}

            <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20 backdrop-blur-sm text-center">
              <p className="text-xs text-cyan-200 mb-1 font-medium">Đá</p>
              <p className="text-lg sm:text-xl font-bold">{bucket50kg.daThung.toFixed(2)} <span className="text-xs font-normal">thùng</span></p>
              <p className="text-[10px] text-cyan-100/70 mt-1">~ {bucket50kg.daLiters.toFixed(1)} lít</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20 backdrop-blur-sm text-center">
              <p className="text-xs text-cyan-200 mb-1 font-medium">Nước</p>
              <p className="text-lg sm:text-xl font-bold">{bucket50kg.nuocThung.toFixed(2)} <span className="text-xs font-normal">thùng</span></p>
              <p className="text-[10px] text-cyan-100/70 mt-1">~ {bucket50kg.nuocLiters.toFixed(1)} lít</p>
            </div>
          </div>
          
          {/* Background decorations */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
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
