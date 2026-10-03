import React, { useState, useMemo } from 'react';
import { RefreshCcw, Scale, Hammer, Ruler, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SteelTensileTest() {
  // Section 1: Constants
  const [diameter, setDiameter] = useState<number>(16);
  const [massSampleLength, setMassSampleLength] = useState<number>(1000);
  const [tensileInitialLength, setTensileInitialLength] = useState<number>(160);

  // Section 2 & 3: Variables
  const [actualMass, setActualMass] = useState<string>('');
  const [yieldForce, setYieldForce] = useState<string>('');
  const [ultimateForce, setUltimateForce] = useState<string>('');
  const [finalLength, setFinalLength] = useState<string>('');

  const handleReset = () => {
    setActualMass('');
    setYieldForce('');
    setUltimateForce('');
    setFinalLength('');
  };

  // Calculations
  const results = useMemo(() => {
    // Base properties
    const A0 = (Math.PI * Math.pow(diameter, 2)) / 4;
    const m_tc = 0.00785 * A0;

    // Mass tolerance
    let m_tt = null;
    let tolerance = null;
    let isMassPass = null;
    let allowedLimitText = '';

    const parsedActualMass = parseFloat(actualMass);
    if (!isNaN(parsedActualMass) && massSampleLength > 0) {
      m_tt = parsedActualMass / massSampleLength;
      tolerance = ((m_tt - m_tc) / m_tc) * 100;
      
      let limit = 0;
      if (diameter <= 8) {
        limit = 8;
      } else if (diameter >= 10 && diameter <= 14) {
        limit = 5;
      } else if (diameter >= 16) {
        limit = 4;
      }
      
      allowedLimitText = `±${limit}%`;
      isMassPass = Math.abs(tolerance) <= limit;
    }

    // Tensile properties
    let Re = null;
    let Rm = null;
    let A = null;

    const parsedYieldForce = parseFloat(yieldForce);
    const parsedUltimateForce = parseFloat(ultimateForce);
    const parsedFinalLength = parseFloat(finalLength);

    if (!isNaN(parsedYieldForce)) {
      Re = (parsedYieldForce * 1000) / A0;
    }
    if (!isNaN(parsedUltimateForce)) {
      Rm = (parsedUltimateForce * 1000) / A0;
    }
    if (!isNaN(parsedFinalLength) && tensileInitialLength > 0) {
      A = ((parsedFinalLength - tensileInitialLength) / tensileInitialLength) * 100;
    }

    return {
      A0, m_tc,
      m_tt, tolerance, isMassPass, allowedLimitText,
      Re, Rm, A
    };
  }, [diameter, massSampleLength, tensileInitialLength, actualMass, yieldForce, ultimateForce, finalLength]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* 1. Thông số mẫu thép */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
        <div className="bg-white/40 dark:bg-slate-800/40 border-b border-white/40 dark:border-slate-700/50 p-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-slate-500" />
            1. Thông số mẫu thép
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Đường kính danh định d (mm)
              </label>
              <select
                value={diameter}
                onChange={e => {
                  const d = Number(e.target.value);
                  setDiameter(d);
                  setTensileInitialLength(d * 10); // Standard 10d or 5d, defaulting to 10d on change
                }}
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-white/60 dark:border-slate-600/50 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {[6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32].map(d => (
                  <option key={d} value={d}>D{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Chiều dài mẫu (mm)
              </label>
              <input
                type="number"
                value={massSampleLength}
                onChange={e => setMassSampleLength(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-white/60 dark:border-slate-600/50 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Chiều dài ban đầu L₀ (mm)
              </label>
              <input
                type="number"
                value={tensileInitialLength}
                onChange={e => setTensileInitialLength(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-white/60 dark:border-slate-600/50 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/50 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Diện tích danh định A₀: </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{results.A0.toFixed(3)} mm²</span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">K.lượng tiêu chuẩn: </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{results.m_tc.toFixed(3)} kg/m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. Kiểm tra dung sai khối lượng */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 flex flex-col">
          <div className="bg-emerald-50/40 dark:bg-emerald-900/30 border-b border-white/40 dark:border-slate-700/50 p-4">
            <h2 className="font-semibold text-emerald-800 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              2. Khối lượng & Dung sai
            </h2>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Khối lượng mẫu (g)
              </label>
              <input
                type="number"
                value={actualMass}
                onChange={e => setActualMass(e.target.value)}
                placeholder="VD: 1570"
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-emerald-200/60 dark:border-emerald-500/30 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            {results.tolerance !== null && (
              <div className="mt-auto">
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Khối lượng thực tế 1m:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{results.m_tt?.toFixed(3)} kg/m</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Sai lệch khối lượng:</span>
                    <span className={`font-semibold ${results.tolerance > 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {results.tolerance > 0 ? '+' : ''}{results.tolerance.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Kéo thép (Tensile Test) */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 flex flex-col">
          <div className="bg-blue-50/40 dark:bg-blue-900/30 border-b border-white/40 dark:border-slate-700/50 p-4">
            <h2 className="font-semibold text-blue-800 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-blue-600" />
              3. Thử kéo
            </h2>
          </div>
          <div className="p-4 space-y-4 flex-1 flex flex-col">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Lực chảy F<sub>y</sub> (kN)
                </label>
                <input
                  type="number"
                  value={yieldForce}
                  onChange={e => setYieldForce(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-blue-200/60 dark:border-blue-500/30 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Lực đứt F<sub>u</sub> (kN)
                </label>
                <input
                  type="number"
                  value={ultimateForce}
                  onChange={e => setUltimateForce(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-blue-200/60 dark:border-blue-500/30 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Chiều dài sau khi đứt L<sub>u</sub> (mm)
                </label>
                <input
                  type="number"
                  value={finalLength}
                  onChange={e => setFinalLength(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-blue-200/60 dark:border-blue-500/30 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/60 p-2 rounded px-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">Giới hạn chảy R<sub>e</sub></span>
                <span className="font-semibold text-blue-700">
                  {results.Re !== null ? `${results.Re.toFixed(1)} MPa` : '---'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/60 p-2 rounded px-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">Giới hạn bền R<sub>m</sub></span>
                <span className="font-semibold text-blue-700">
                  {results.Rm !== null ? `${results.Rm.toFixed(1)} MPa` : '---'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/60 p-2 rounded px-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">Độ giãn dài A</span>
                <span className="font-semibold text-blue-700">
                  {results.A !== null ? `${results.A.toFixed(1)} %` : '---'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-transparent hover:border-red-100"
        >
          <RefreshCcw className="w-4 h-4" />
          Xóa dữ liệu
        </button>
      </div>

    </div>
  );
}
