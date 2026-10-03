import React, { useState, useMemo, useEffect } from 'react';
import { Ruler, Activity, CheckCircle2, AlertTriangle, RotateCcw, Calculator } from 'lucide-react';

const MATERIAL_TYPES = [
  { id: 'soil', name: 'Đất nền (μ = 0.35)', mu: 0.35 },
  { id: 'material', name: 'Vật liệu áo đường (μ = 0.25)', mu: 0.25 },
  { id: 'structure', name: 'Cả kết cấu áo đường (μ = 0.30)', mu: 0.30 },
];

export default function ElasticModulusTest() {
  const [constants, setConstants] = useState({
    plateDiameterD: '33',
    loadPressureP: '0.5',
    materialType: 'soil'
  });

  const [measurements, setMeasurements] = useState({
    l1: '',
    l2: '',
    l3: ''
  });

  // Dial gauge calculators
  const [showCalc, setShowCalc] = useState({ l1: true, l2: true, l3: true });
  const [calcData, setCalcData] = useState({
    l1: { d1: '', d2: '' },
    l2: { d1: '', d2: '' },
    l3: { d1: '', d2: '' }
  });

  const handleCalcDataChange = (point: 'l1'|'l2'|'l3', field: 'd1'|'d2', value: string) => {
    setCalcData(prev => ({
      ...prev,
      [point]: { ...prev[point], [field]: value }
    }));
  };

  const toggleCalc = (point: 'l1'|'l2'|'l3') => {
    setShowCalc(prev => ({ ...prev, [point]: !prev[point] }));
  };

  // Auto calculate l1, l2, l3 from dial gauges
  useEffect(() => {
    (['l1', 'l2', 'l3'] as const).forEach(point => {
      if (showCalc[point]) {
        const v1 = parseFloat(calcData[point].d1);
        const v2 = parseFloat(calcData[point].d2);
        
        if (!isNaN(v1) && !isNaN(v2)) {
          const diff = Math.abs(v1 - v2);
          setMeasurements(p => ({ ...p, [point]: (diff * 2 * 0.01).toFixed(2) }));
        } else {
          setMeasurements(p => ({ ...p, [point]: '' }));
        }
      }
    });
  }, [calcData, showCalc]);

  const handleConstantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConstants(prev => ({ ...prev, [name]: value }));
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setMeasurements({ l1: '', l2: '', l3: '' });
    setCalcData({
      l1: { d1: '', d2: '' },
      l2: { d1: '', d2: '' },
      l3: { d1: '', d2: '' }
    });
  };

  const results = useMemo(() => {
    const D = parseFloat(constants.plateDiameterD);
    const P = parseFloat(constants.loadPressureP);
    const material = MATERIAL_TYPES.find(m => m.id === constants.materialType);
    const mu = material ? material.mu : 0.35;

    const l1 = parseFloat(measurements.l1);
    const l2 = parseFloat(measurements.l2);
    const l3 = parseFloat(measurements.l3);

    // Calculate individual modulus
    const calculateE = (l: number) => {
      if (isNaN(l) || l <= 0 || isNaN(D) || isNaN(P) || D <= 0 || P <= 0) return null;
      // D is in cm -> convert to mm (D * 10)
      return (Math.PI * P * (D * 10) * (1 - Math.pow(mu, 2))) / (4 * l);
    };

    const E1 = calculateE(l1);
    const E2 = calculateE(l2);
    const E3 = calculateE(l3);

    let E_avg = null;
    if (E1 !== null && E2 !== null && E3 !== null) {
      E_avg = (E1 + E2 + E3) / 3;
    }

    return { E1, E2, E3, E_avg };
  }, [constants, measurements]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 font-sans">
      <div className="flex items-center space-x-2 border-b pb-4">
        <Activity className="w-8 h-8 text-orange-600" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Đo Mô đun đàn hồi (theo 22TCN211-06)</h1>
      </div>

      <div className="space-y-6">
        {/* Section 1: Constants */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4 transition-all">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">1. Thông số thiết bị & Vật liệu</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Đường kính tấm ép D (cm)</label>
              <input 
                type="number" 
                name="plateDiameterD"
                value={constants.plateDiameterD}
                onChange={handleConstantChange}
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-orange-200 dark:border-orange-700/50 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cấp tải trọng p (MPa)</label>
              <input 
                type="number" 
                name="loadPressureP"
                value={constants.loadPressureP}
                onChange={handleConstantChange}
                step="0.1"
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-orange-200 dark:border-orange-700/50 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại vật liệu / Hệ số Poisson (μ)</label>
              <select 
                name="materialType"
                value={constants.materialType}
                onChange={handleConstantChange}
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-orange-200 dark:border-orange-700/50 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              >
                {MATERIAL_TYPES.map(m => (
                  <option key={m.id} value={m.id} className="dark:bg-slate-800">{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Measurements */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4 transition-all">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">2. Số liệu đo hiện trường</h2>
            <button 
              onClick={handleClear}
              className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 py-1 rounded transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xóa</span>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* L1 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Biến dạng hồi phục điểm 1 - l₁ (mm)</label>
                <button onClick={() => toggleCalc('l1')} className={`p-1 rounded transition-colors ${showCalc.l1 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30'}`} title="Tính từ đồng hồ so">
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  name="l1" 
                  value={measurements.l1} 
                  onChange={handleMeasurementChange} 
                  readOnly={showCalc.l1}
                  className={`flex-1 px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-orange-200 dark:border-orange-700/50 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${showCalc.l1 ? 'opacity-70 cursor-not-allowed' : ''}`} 
                  placeholder="0.00" 
                />
                <div className="w-32 text-sm text-slate-500 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 flex-shrink-0 text-center font-medium shadow-inner">
                  {results.E1 ? `E = ${results.E1.toFixed(1)} MPa` : 'E = ---'}
                </div>
              </div>
              {showCalc.l1 && (
                <div className="mt-2 p-3 bg-orange-50/80 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 text-xs">Số đọc đầu (có tải)</label>
                      <input type="number" value={calcData.l1.d1} onChange={e => handleCalcDataChange('l1', 'd1', e.target.value)} className="w-full px-2 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-orange-200 dark:border-orange-800/50 rounded outline-none focus:ring-1 focus:ring-orange-400 text-slate-800 dark:text-slate-100" placeholder="VD: 120" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 text-xs">Số đọc sau (xả tải)</label>
                      <input type="number" value={calcData.l1.d2} onChange={e => handleCalcDataChange('l1', 'd2', e.target.value)} className="w-full px-2 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-orange-200 dark:border-orange-800/50 rounded outline-none focus:ring-1 focus:ring-orange-400 text-slate-800 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 text-xs font-medium">Số vạch chuyển vị</label>
                      <input type="text" readOnly className="w-full px-2 py-1.5 border border-orange-200/50 dark:border-orange-800/30 bg-orange-100/50 dark:bg-orange-900/30 rounded text-orange-800 dark:text-orange-300 outline-none font-medium" placeholder="---" value={(!isNaN(parseFloat(calcData.l1.d1)) && !isNaN(parseFloat(calcData.l1.d2))) ? Math.abs(parseFloat(calcData.l1.d1) - parseFloat(calcData.l1.d2)) : ''} />
                    </div>
                  </div>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80 italic mt-1">Biến dạng hồi phục = (Số đọc đầu - Số đọc sau) × 2 × 0.01.</p>
                </div>
              )}
            </div>

            {/* L2 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Biến dạng hồi phục điểm 2 - l₂ (mm)</label>
                <button onClick={() => toggleCalc('l2')} className={`p-1 rounded transition-colors ${showCalc.l2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30'}`} title="Tính từ đồng hồ so">
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  name="l2" 
                  value={measurements.l2} 
                  onChange={handleMeasurementChange} 
                  readOnly={showCalc.l2}
                  className={`flex-1 px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-orange-200 dark:border-orange-700/50 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${showCalc.l2 ? 'opacity-70 cursor-not-allowed' : ''}`} 
                  placeholder="0.00" 
                />
                <div className="w-32 text-sm text-slate-500 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 flex-shrink-0 text-center font-medium shadow-inner">
                  {results.E2 ? `E = ${results.E2.toFixed(1)} MPa` : 'E = ---'}
                </div>
              </div>
              {showCalc.l2 && (
                <div className="mt-2 p-3 bg-orange-50/80 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 text-xs">Số đọc đầu (có tải)</label>
                      <input type="number" value={calcData.l2.d1} onChange={e => handleCalcDataChange('l2', 'd1', e.target.value)} className="w-full px-2 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-orange-200 dark:border-orange-800/50 rounded outline-none focus:ring-1 focus:ring-orange-400 text-slate-800 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 text-xs">Số đọc sau (xả tải)</label>
                      <input type="number" value={calcData.l2.d2} onChange={e => handleCalcDataChange('l2', 'd2', e.target.value)} className="w-full px-2 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-orange-200 dark:border-orange-800/50 rounded outline-none focus:ring-1 focus:ring-orange-400 text-slate-800 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 text-xs font-medium">Số vạch chuyển vị</label>
                      <input type="text" readOnly className="w-full px-2 py-1.5 border border-orange-200/50 dark:border-orange-800/30 bg-orange-100/50 dark:bg-orange-900/30 rounded text-orange-800 dark:text-orange-300 outline-none font-medium" placeholder="---" value={(!isNaN(parseFloat(calcData.l2.d1)) && !isNaN(parseFloat(calcData.l2.d2))) ? Math.abs(parseFloat(calcData.l2.d1) - parseFloat(calcData.l2.d2)) : ''} />
                    </div>
                  </div>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80 italic mt-1">Biến dạng hồi phục = (Số đọc đầu - Số đọc sau) × 2 × 0.01.</p>
                </div>
              )}
            </div>

            {/* L3 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Biến dạng hồi phục điểm 3 - l₃ (mm)</label>
                <button onClick={() => toggleCalc('l3')} className={`p-1 rounded transition-colors ${showCalc.l3 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30'}`} title="Tính từ đồng hồ so">
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  name="l3" 
                  value={measurements.l3} 
                  onChange={handleMeasurementChange} 
                  readOnly={showCalc.l3}
                  className={`flex-1 px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-orange-200 dark:border-orange-700/50 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${showCalc.l3 ? 'opacity-70 cursor-not-allowed' : ''}`} 
                  placeholder="0.00" 
                />
                <div className="w-32 text-sm text-slate-500 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 flex-shrink-0 text-center font-medium shadow-inner">
                  {results.E3 ? `E = ${results.E3.toFixed(1)} MPa` : 'E = ---'}
                </div>
              </div>
              {showCalc.l3 && (
                <div className="mt-2 p-3 bg-orange-50/80 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 text-xs">Số đọc đầu (có tải)</label>
                      <input type="number" value={calcData.l3.d1} onChange={e => handleCalcDataChange('l3', 'd1', e.target.value)} className="w-full px-2 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-orange-200 dark:border-orange-800/50 rounded outline-none focus:ring-1 focus:ring-orange-400 text-slate-800 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 text-xs">Số đọc sau (xả tải)</label>
                      <input type="number" value={calcData.l3.d2} onChange={e => handleCalcDataChange('l3', 'd2', e.target.value)} className="w-full px-2 py-1.5 bg-white/70 dark:bg-slate-800/70 border border-orange-200 dark:border-orange-800/50 rounded outline-none focus:ring-1 focus:ring-orange-400 text-slate-800 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1 text-xs font-medium">Số vạch chuyển vị</label>
                      <input type="text" readOnly className="w-full px-2 py-1.5 border border-orange-200/50 dark:border-orange-800/30 bg-orange-100/50 dark:bg-orange-900/30 rounded text-orange-800 dark:text-orange-300 outline-none font-medium" placeholder="---" value={(!isNaN(parseFloat(calcData.l3.d1)) && !isNaN(parseFloat(calcData.l3.d2))) ? Math.abs(parseFloat(calcData.l3.d1) - parseFloat(calcData.l3.d2)) : ''} />
                    </div>
                  </div>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80 italic mt-1">Biến dạng hồi phục = (Số đọc đầu - Số đọc sau) × 2 × 0.01.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Result */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-1 relative overflow-hidden shadow-lg mt-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-8 -mb-8"></div>
          
          <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 sm:p-8 relative z-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Mô đun đàn hồi trung bình</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Trị số đại diện từ 3 điểm đo</p>
            
            {results.E_avg !== null ? (
              <div className="text-5xl sm:text-6xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-baseline gap-2">
                {results.E_avg.toFixed(1)}
                <span className="text-2xl text-slate-400 dark:text-slate-500 font-semibold">MPa</span>
              </div>
            ) : (
              <div className="opacity-40 py-4 flex flex-col items-center">
                <Calculator className="w-12 h-12 mb-3 text-slate-400" />
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Nhập đủ 3 số liệu đo<br />để xem kết quả trung bình
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
