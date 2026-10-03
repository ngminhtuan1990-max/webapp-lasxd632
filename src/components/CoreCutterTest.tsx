import React, { useState, useMemo, useEffect } from 'react';
import { RotateCcw, Calculator, FileSpreadsheet, Beaker, Cylinder } from 'lucide-react';

export default function CoreCutterTest() {
  // Section 1: Thông số tiêu chuẩn & Dao vòng (Constants)
  const [constants, setConstants] = useState({
    ringVolume: 100,      // Thể tích dao vòng (cm³)
    ringWeight: 125,      // Khối lượng dao vòng rỗng (g)
    maxDryDensity: 1.85,  // Dung trọng khô lớn nhất (g/cm³)
    kRequired: 0.95       // Hệ số K yêu cầu
  });

  // Section 2: Số liệu đo tại hiện trường (Field Measurements)
  const [measurements, setMeasurements] = useState({
    ringPlusWetSoilWeight: '', // Khối lượng dao vòng + đất ướt (g)
    moisture: ''               // Độ ẩm của đất (%)
  });

  // Sub-calculator for Moisture & Volume
  const [showCalcMoisture, setShowCalcMoisture] = useState(false);
  const [calcMoisture, setCalcMoisture] = useState({ wBox: '', wBoxWet: '', wBoxDry: '' });

  const [showCalcVolume, setShowCalcVolume] = useState(false);
  const [calcVolume, setCalcVolume] = useState({ diameter: '', height: '' });

  // Auto-calculate Volume
  useEffect(() => {
    if (showCalcVolume) {
      const d = parseFloat(calcVolume.diameter);
      const h = parseFloat(calcVolume.height);
      if (!isNaN(d) && !isNaN(h) && d > 0 && h > 0) {
        const volume = (Math.PI * Math.pow(d, 2) * h) / 4;
        setConstants(prev => ({ ...prev, ringVolume: parseFloat(volume.toFixed(2)) }));
      }
    }
  }, [calcVolume, showCalcVolume]);

  // Auto-calculate Moisture
  useEffect(() => {
    if (showCalcMoisture) {
      const wBox = parseFloat(calcMoisture.wBox);
      const wBoxWet = parseFloat(calcMoisture.wBoxWet);
      const wBoxDry = parseFloat(calcMoisture.wBoxDry);
      if (!isNaN(wBox) && !isNaN(wBoxWet) && !isNaN(wBoxDry) && (wBoxDry - wBox) > 0) {
        const moisture = ((wBoxWet - wBoxDry) / (wBoxDry - wBox)) * 100;
        setMeasurements(prev => ({ ...prev, moisture: moisture.toFixed(2) }));
      }
    }
  }, [calcMoisture, showCalcMoisture]);

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
      ringPlusWetSoilWeight: '',
      moisture: ''
    });
    setCalcMoisture({ wBox: '', wBoxWet: '', wBoxDry: '' });
    // Keep volume calc as it's part of constants, but could clear it if wanted.
  };

  // Calculations
  const results = useMemo(() => {
    const wTotal = parseFloat(measurements.ringPlusWetSoilWeight);
    const moisture = parseFloat(measurements.moisture);

    // Validate inputs
    if (isNaN(wTotal) || isNaN(moisture) || constants.ringVolume <= 0 || (1 + moisture / 100) === 0 || constants.maxDryDensity === 0) {
      return null;
    }

    const wetSoilWeight = wTotal - constants.ringWeight;
    if (wetSoilWeight <= 0) return null;

    const wetDensity = wetSoilWeight / constants.ringVolume;
    const dryDensity = wetDensity / (1 + (moisture / 100));
    const k = dryDensity / constants.maxDryDensity;

    return {
      wetSoilWeight,
      wetDensity,
      dryDensity,
      k: k.toFixed(3)
    };
  }, [measurements, constants]);

  const isPass = results ? parseFloat(results.k) >= constants.kRequired : null;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 font-sans">
      <div className="flex items-center space-x-2 border-b pb-4">
        <Cylinder className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Thí nghiệm độ chặt bằng dao vòng (Core Cutter Test)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1 - Thông số tiêu chuẩn & Dao vòng */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-semibold mb-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <h2>1. Thông số tiêu chuẩn & Dao vòng</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Thể tích dao vòng (cm³)</label>
                <button 
                  onClick={() => setShowCalcVolume(!showCalcVolume)} 
                  className={`p-1 rounded transition-colors ${showCalcVolume ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`} 
                  title="Tính toán từ kích thước"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <input 
                type="number" 
                name="ringVolume"
                value={constants.ringVolume}
                onChange={handleConstantChange}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
              
              {showCalcVolume && (
                <div className="mt-2 p-3 bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 backdrop-blur-sm rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">Đường kính d (cm)</label>
                      <input type="number" value={calcVolume.diameter} onChange={e => setCalcVolume({...calcVolume, diameter: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-indigo-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">Chiều cao h (cm)</label>
                      <input type="number" value={calcVolume.height} onChange={e => setCalcVolume({...calcVolume, height: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-indigo-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Khối lượng dao vòng rỗng (g)</label>
              <input 
                type="number" 
                name="ringWeight"
                value={constants.ringWeight}
                onChange={handleConstantChange}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Dung trọng khô lớn nhất (g/cm³)</label>
              <input 
                type="number" 
                name="maxDryDensity"
                value={constants.maxDryDensity}
                onChange={handleConstantChange}
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
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
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Section 2 - Số liệu đo tại hiện trường */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-semibold">
              <Beaker className="w-5 h-5" />
              <h2>2. Số liệu đo tại hiện trường</h2>
            </div>
            <button 
              onClick={handleClearMeasurements}
              className="flex items-center space-x-1 text-sm text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xóa dữ liệu hố đo</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">KL dao vòng + đất ướt (g)</label>
              <input 
                type="number" 
                name="ringPlusWetSoilWeight"
                value={measurements.ringPlusWetSoilWeight}
                onChange={handleMeasurementChange}
                placeholder="Ví dụ: 305"
                className="w-full px-4 py-2 text-lg border bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Độ ẩm của đất (%)</label>
                <button 
                  onClick={() => setShowCalcMoisture(!showCalcMoisture)} 
                  className={`p-1 rounded transition-colors ${showCalcMoisture ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`} 
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
                placeholder="Ví dụ: 12.5"
                className="w-full px-4 py-2 text-lg border bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                step="0.1"
              />
              
              {showCalcMoisture && (
                <div className="mt-2 p-3 bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 backdrop-blur-sm rounded-lg space-y-2 text-sm animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL hộp (g)</label>
                      <input type="number" value={calcMoisture.wBox} onChange={e => setCalcMoisture({...calcMoisture, wBox: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-indigo-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL hộp+đất ướt</label>
                      <input type="number" value={calcMoisture.wBoxWet} onChange={e => setCalcMoisture({...calcMoisture, wBoxWet: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-indigo-400" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 mb-1">KL hộp+đất khô</label>
                      <input type="number" value={calcMoisture.wBoxDry} onChange={e => setCalcMoisture({...calcMoisture, wBoxDry: e.target.value})} className="w-full px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded outline-none focus:ring-1 focus:ring-indigo-400" />
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
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">KL đất ướt</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{results.wetSoilWeight.toFixed(1)} g</span>
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
