import React, { useState, useMemo, useEffect } from 'react';
import { RotateCcw, Calculator, FileSpreadsheet, Beaker } from 'lucide-react';

export default function SandConeTest() {
  // Section 1: Thông số vật liệu chuẩn (Constants)
  const [constants, setConstants] = useState({
    coneSandWeight: 1550, // Khối lượng cát trong phễu nón (g)
    sandDensity: 1.45,    // Dung trọng cát chuẩn (g/cm³)
    maxDryDensity: 2.15,  // Dung trọng khô lớn nhất (g/cm³)
    kRequired: 0.95       // Hệ số K yêu cầu
  });

  // Section 2: Số liệu đo tại hố (Field Measurements)
  const [measurements, setMeasurements] = useState({
    w1: '',       // Khối lượng phễu + cát ban đầu (g)
    w2: '',       // Khối lượng phễu + cát còn lại (g)
    wWet: '',     // Khối lượng đất ướt từ hố đào (g)
    moisture: ''  // Độ ẩm của đất (%)
  });

  // States for Sub-calculators
  const [showCalc, setShowCalc] = useState({
    coneSandWeight: false,
    sandDensity: false,
    moisture: false
  });

  const [calcCone, setCalcCone] = useState({ wConeInit: '', wConeLeft: '' });
  const [calcDensity, setCalcDensity] = useState({ vMeasure: '', wMeasureBox: '', wMeasureBoxSand: '' });
  const [calcMoisture, setCalcMoisture] = useState({ wBox: '', wBoxWet: '', wBoxDry: '' });

  // Auto-calculate for Cone Sand Weight
  useEffect(() => {
    if (showCalc.coneSandWeight) {
      const wInit = parseFloat(calcCone.wConeInit);
      const wLeft = parseFloat(calcCone.wConeLeft);
      if (!isNaN(wInit) && !isNaN(wLeft)) {
        setConstants(prev => ({ ...prev, coneSandWeight: parseFloat((wInit - wLeft).toFixed(2)) }));
      }
    }
  }, [calcCone, showCalc.coneSandWeight]);

  // Auto-calculate for Sand Density
  useEffect(() => {
    if (showCalc.sandDensity) {
      const vMeasure = parseFloat(calcDensity.vMeasure);
      const wBox = parseFloat(calcDensity.wMeasureBox);
      const wBoxSand = parseFloat(calcDensity.wMeasureBoxSand);
      if (!isNaN(vMeasure) && !isNaN(wBox) && !isNaN(wBoxSand) && vMeasure > 0) {
        const density = (wBoxSand - wBox) / vMeasure;
        setConstants(prev => ({ ...prev, sandDensity: parseFloat(density.toFixed(3)) }));
      }
    }
  }, [calcDensity, showCalc.sandDensity]);

  // Auto-calculate for Moisture
  useEffect(() => {
    if (showCalc.moisture) {
      const wBox = parseFloat(calcMoisture.wBox);
      const wBoxWet = parseFloat(calcMoisture.wBoxWet);
      const wBoxDry = parseFloat(calcMoisture.wBoxDry);
      if (!isNaN(wBox) && !isNaN(wBoxWet) && !isNaN(wBoxDry) && (wBoxDry - wBox) > 0) {
        const moisture = ((wBoxWet - wBoxDry) / (wBoxDry - wBox)) * 100;
        setMeasurements(prev => ({ ...prev, moisture: moisture.toFixed(2) }));
      }
    }
  }, [calcMoisture, showCalc.moisture]);

  const toggleCalc = (key: keyof typeof showCalc) => {
    setShowCalc(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle changes for constants
  const handleConstantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConstants(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Handle changes for measurements
  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({ ...prev, [name]: value }));
  };

  // Clear measurements
  const handleClearMeasurements = () => {
    setMeasurements({
      w1: '',
      w2: '',
      wWet: '',
      moisture: ''
    });
    setCalcMoisture({ wBox: '', wBoxWet: '', wBoxDry: '' });
  };

  // Calculations
  const results = useMemo(() => {
    const w1 = parseFloat(measurements.w1);
    const w2 = parseFloat(measurements.w2);
    const wWet = parseFloat(measurements.wWet);
    const moisture = parseFloat(measurements.moisture);

    if (isNaN(w1) || isNaN(w2) || isNaN(wWet) || isNaN(moisture) || constants.sandDensity === 0 || (1 + moisture / 100) === 0 || constants.maxDryDensity === 0) {
      return null;
    }

    const wHoleSand = w1 - w2 - constants.coneSandWeight;
    const volume = wHoleSand / constants.sandDensity;
    
    if (volume <= 0) return null;

    const wetDensity = wWet / volume;
    const dryDensity = wetDensity / (1 + (moisture / 100));
    const k = dryDensity / constants.maxDryDensity;

    return {
      wHoleSand,
      volume,
      wetDensity,
      dryDensity,
      k: k.toFixed(3)
    };
  }, [measurements, constants]);

  const isPass = results ? parseFloat(results.k) >= constants.kRequired : null;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 font-sans">
      <div className="flex items-center space-x-2 border-b pb-4">
        <Calculator className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Thí nghiệm độ chặt bằng rót cát (Sand Cone Test)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1 - Thông số vật liệu chuẩn */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-semibold mb-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <h2>1. Thông số vật liệu chuẩn</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Khối lượng cát trong phễu (g)</label>
                <button 
                  onClick={() => toggleCalc('coneSandWeight')} 
                  className={`p-1 rounded transition-colors ${showCalc.coneSandWeight ? 'bg-blue-100 text-blue-700' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`} 
                  title="Tính toán hiệu chuẩn"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <input 
                type="number" 
                name="coneSandWeight"
                value={constants.coneSandWeight}
                onChange={handleConstantChange}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              {showCalc.coneSandWeight && (
                <div className="mt-2 p-3 bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL bình+cát b.đầu (g)</label>
                      <input type="number" value={calcCone.wConeInit} onChange={e => setCalcCone({...calcCone, wConeInit: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL bình+cát còn lại (g)</label>
                      <input type="number" value={calcCone.wConeLeft} onChange={e => setCalcCone({...calcCone, wConeLeft: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Dung trọng cát chuẩn (g/cm³)</label>
                <button 
                  onClick={() => toggleCalc('sandDensity')} 
                  className={`p-1 rounded transition-colors ${showCalc.sandDensity ? 'bg-blue-100 text-blue-700' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`} 
                  title="Tính toán hiệu chuẩn"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <input 
                type="number" 
                name="sandDensity"
                value={constants.sandDensity}
                onChange={handleConstantChange}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                step="0.01"
              />
              {showCalc.sandDensity && (
                <div className="mt-2 p-3 bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">Thể tích bình (cm³)</label>
                      <input type="number" value={calcDensity.vMeasure} onChange={e => setCalcDensity({...calcDensity, vMeasure: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL bình (g)</label>
                      <input type="number" value={calcDensity.wMeasureBox} onChange={e => setCalcDensity({...calcDensity, wMeasureBox: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL bình+cát (g)</label>
                      <input type="number" value={calcDensity.wMeasureBoxSand} onChange={e => setCalcDensity({...calcDensity, wMeasureBoxSand: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Dung trọng khô lớn nhất (g/cm³)</label>
              <input 
                type="number" 
                name="maxDryDensity"
                value={constants.maxDryDensity}
                onChange={handleConstantChange}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Hệ số K yêu cầu</label>
              <input 
                type="number" 
                name="kRequired"
                value={constants.kRequired}
                onChange={handleConstantChange}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Section 2 - Số liệu đo tại hố */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-blue-700 font-semibold">
              <Beaker className="w-5 h-5" />
              <h2>2. Số liệu đo tại hố</h2>
            </div>
            <button 
              onClick={handleClearMeasurements}
              className="flex items-center space-x-1 text-sm text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xóa dữ liệu</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">KL phễu + cát ban đầu w1 (g)</label>
              <input 
                type="number" 
                name="w1"
                value={measurements.w1}
                onChange={handleMeasurementChange}
                placeholder="Ví dụ: 7000"
                className="w-full px-4 py-2 text-lg border bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">KL phễu + cát còn lại w2 (g)</label>
              <input 
                type="number" 
                name="w2"
                value={measurements.w2}
                onChange={handleMeasurementChange}
                placeholder="Ví dụ: 3200"
                className="w-full px-4 py-2 text-lg border bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Khối lượng đất ướt hố đào (g)</label>
              <input 
                type="number" 
                name="wWet"
                value={measurements.wWet}
                onChange={handleMeasurementChange}
                placeholder="Ví dụ: 3500"
                className="w-full px-4 py-2 text-lg border bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Độ ẩm của đất (%)</label>
                <button 
                  onClick={() => toggleCalc('moisture')} 
                  className={`p-1 rounded transition-colors ${showCalc.moisture ? 'bg-blue-100 text-blue-700' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`} 
                  title="Tính toán từ mẫu sấy"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <input 
                type="number" 
                name="moisture"
                value={measurements.moisture}
                onChange={handleMeasurementChange}
                placeholder="Ví dụ: 10.5"
                className="w-full px-4 py-2 text-lg border bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                step="0.1"
              />
              {showCalc.moisture && (
                <div className="mt-2 p-3 bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL hộp (g)</label>
                      <input type="number" value={calcMoisture.wBox} onChange={e => setCalcMoisture({...calcMoisture, wBox: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL hộp+đất ướt</label>
                      <input type="number" value={calcMoisture.wBoxWet} onChange={e => setCalcMoisture({...calcMoisture, wBoxWet: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL hộp+đất khô</label>
                      <input type="number" value={calcMoisture.wBoxDry} onChange={e => setCalcMoisture({...calcMoisture, wBoxDry: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kết quả tính toán */}
      <div className={`mt-6 p-6 rounded-2xl shadow-lg border-2 transition-colors duration-300 ${
        results 
          ? (isPass ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-500' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-500') 
          : 'bg-white/60 dark:bg-slate-800/60 border-white/50 dark:border-slate-700/50 backdrop-blur-xl shadow-xl'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Hệ số đầm chặt (K)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Yêu cầu: K &ge; {constants.kRequired}</p>
          </div>
          
          <div className="text-center">
            <div className={`text-5xl font-black ${
              results 
                ? (isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400') 
                : 'text-gray-300'
            }`}>
              {results ? results.k : '-.---'}
            </div>
            {results && (
              <div className={`text-sm font-bold mt-1 ${isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {isPass ? 'ĐẠT YÊU CẦU (PASS)' : 'KHÔNG ĐẠT (FAIL)'}
              </div>
            )}
          </div>
        </div>

        {/* Intermediate Results */}
        {results && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">KL cát trong hố</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{results.wHoleSand.toFixed(1)} g</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thể tích hố</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{results.volume.toFixed(1)} cm³</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dung trọng ướt</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{results.wetDensity.toFixed(3)} g/cm³</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dung trọng khô</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{results.dryDensity.toFixed(3)} g/cm³</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
