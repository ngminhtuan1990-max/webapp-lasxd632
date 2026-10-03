import React, { useState, useMemo } from 'react';
import { Layers, Activity, AlertTriangle, RotateCcw, Calculator, FileText, XCircle } from 'lucide-react';

const round0_05 = (val: number) => Math.round(val * 20) / 20;
const round0_1 = (val: number) => Math.round(val * 10) / 10;

export default function MortarStrengthTest() {
  const [constants, setConstants] = useState({
    widthB: 40,
    heightH: 40,
    spanL: 100,
    areaA: 1600
  });

  const [pu, setPu] = useState<(number | '')[]>(['', '', '']);
  const [pn, setPn] = useState<(number | '')[]>(['', '', '', '', '', '']);

  const handleConstantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConstants(prev => ({ ...prev, [name]: value ? Number(value) : '' }));
  };

  const handlePuChange = (index: number, val: string) => {
    const newPu = [...pu];
    newPu[index] = val ? Number(val) : '';
    setPu(newPu);
  };

  const handlePnChange = (index: number, val: string) => {
    const newPn = [...pn];
    newPn[index] = val ? Number(val) : '';
    setPn(newPn);
  };

  const handleClear = () => {
    setPu(['', '', '']);
    setPn(['', '', '', '', '', '']);
  };

  const results = useMemo(() => {
    const { widthB, heightH, spanL, areaA } = constants;

    // Flexural Logic (Uốn)
    const ruList = pu.map(p => {
      if (p === '' || p <= 0) return null;
      return round0_05(1.5 * ((Number(p) * spanL) / (widthB * Math.pow(heightH, 2))));
    });

    let ruFinal: number | null = null;
    let flexuralDiscarded: number[] = [];

    if (ruList.every(r => r !== null)) {
      const validRu = ruList as number[];
      const ruAvgInitial = validRu.reduce((sum, val) => sum + val, 0) / 3;
      
      validRu.forEach((r, idx) => {
        const dev = (Math.abs(r - ruAvgInitial) / ruAvgInitial) * 100;
        if (dev > 10) {
          flexuralDiscarded.push(idx);
        }
      });

      const remainingRu = validRu.filter((_, idx) => !flexuralDiscarded.includes(idx));
      if (remainingRu.length > 0) {
        ruFinal = round0_1(remainingRu.reduce((sum, val) => sum + val, 0) / remainingRu.length);
      } else {
        ruFinal = 0; // all discarded
      }
    }

    // Compressive Logic (Nén)
    const rnList = pn.map(p => {
      if (p === '' || p <= 0) return null;
      return round0_05(Number(p) / areaA);
    });

    let rnFinal: number | null = null;
    let compressiveDiscarded: number[] = [];
    let isRetestRequired = false;

    if (rnList.every(r => r !== null)) {
      const validRn = rnList as number[];
      const rnAvgInitial = validRn.reduce((sum, val) => sum + val, 0) / 6;

      validRn.forEach((r, idx) => {
        const dev = (Math.abs(r - rnAvgInitial) / rnAvgInitial) * 100;
        if (dev > 15) {
          compressiveDiscarded.push(idx);
        }
      });

      const remainingRn = validRn.filter((_, idx) => !compressiveDiscarded.includes(idx));
      if (remainingRn.length === 0) {
        rnFinal = 0;
        isRetestRequired = true;
      } else {
        rnFinal = round0_1(remainingRn.reduce((sum, val) => sum + val, 0) / remainingRn.length);
      }
    }

    return {
      ruList,
      ruFinal,
      flexuralDiscarded,
      rnList,
      rnFinal,
      compressiveDiscarded,
      isRetestRequired
    };
  }, [constants, pu, pn]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Layers className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            Uốn và Nén Vữa
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Xác định cường độ theo TCVN 3121-11:2022</p>
        </div>
        <button 
          onClick={handleClear}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Xóa dữ liệu
        </button>
      </div>

      {/* Section 1: Constants */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" /> 1. Kích thước mẫu (mm)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chiều rộng b</label>
            <input type="number" name="widthB" value={constants.widthB} onChange={handleConstantChange} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-100 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chiều cao h</label>
            <input type="number" name="heightH" value={constants.heightH} onChange={handleConstantChange} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-100 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gối uốn l</label>
            <input type="number" name="spanL" value={constants.spanL} onChange={handleConstantChange} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-100 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diện tích nén A</label>
            <input type="number" name="areaA" value={constants.areaA} onChange={handleConstantChange} className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-100 transition" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 2: Flexural */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4 flex flex-col">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
            <Activity className="w-5 h-5 text-teal-500" /> 2. Cường độ Uốn (R_u)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Lực uốn gãy P_u (N)</p>
          
          <div className="space-y-3 flex-1">
            {[0, 1, 2].map(idx => (
              <div key={`uon-${idx}`} className="flex items-center space-x-3">
                <span className="text-slate-400 font-medium text-sm">#{idx + 1}</span>
                <input 
                  type="number" 
                  value={pu[idx]} 
                  onChange={e => handlePuChange(idx, e.target.value)}
                  className={`flex-1 px-3 py-2 bg-white/50 dark:bg-slate-900/50 border ${results.flexuralDiscarded.includes(idx) ? 'border-red-300 dark:border-red-700/50 text-red-500 line-through' : 'border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100'} rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition`}
                  placeholder="Nhập tải trọng (N)"
                />
                <div className={`w-20 text-sm font-medium px-2 py-2 rounded text-center ${results.flexuralDiscarded.includes(idx) ? 'bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-500/50 line-through' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {results.ruList[idx] !== null ? results.ruList[idx].toFixed(2) : '-'}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
            {results.ruFinal !== null ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-end justify-between bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30">
                  <span className="text-teal-800 dark:text-teal-200 font-medium">R_u trung bình</span>
                  <div className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                    {results.ruFinal.toFixed(1)} <span className="text-sm font-medium text-teal-600 dark:text-teal-400">MPa</span>
                  </div>
                </div>
                {results.flexuralDiscarded.length > 0 && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-2 rounded">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Đã loại bỏ mẫu uốn vượt quá 10% sai số.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">Nhập đủ 3 lực uốn để tính toán</div>
            )}
          </div>
        </div>

        {/* Section 3: Compressive */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4 flex flex-col">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
            <Calculator className="w-5 h-5 text-indigo-500" /> 3. Cường độ Nén (R_n)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Lực nén phá hủy P_n (N) của 6 nửa mẫu</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {[0, 1, 2, 3, 4, 5].map(idx => (
              <div key={`nen-${idx}`} className="flex items-center space-x-2">
                <span className="text-slate-400 font-medium text-sm">#{idx + 1}</span>
                <input 
                  type="number" 
                  value={pn[idx]} 
                  onChange={e => handlePnChange(idx, e.target.value)}
                  className={`flex-1 min-w-0 px-2 py-2 bg-white/50 dark:bg-slate-900/50 border ${results.compressiveDiscarded.includes(idx) ? 'border-red-300 dark:border-red-700/50 text-red-500 line-through' : 'border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                  placeholder="Lực (N)"
                />
                <div className={`w-14 text-xs font-medium px-1 py-2 rounded text-center ${results.compressiveDiscarded.includes(idx) ? 'bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-500/50 line-through' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {results.rnList[idx] !== null ? results.rnList[idx].toFixed(2) : '-'}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
            {results.rnFinal !== null ? (
              <div className="flex flex-col space-y-2">
                {results.isRetestRequired ? (
                   <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-4 rounded-xl flex items-start gap-3">
                     <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                     <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                       Cả 6 mẫu đều sai lệch &gt; 15%. Tiến hành thử lại trên mẫu lưu!
                     </p>
                   </div>
                ) : (
                  <>
                    <div className="flex items-end justify-between bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <span className="text-indigo-800 dark:text-indigo-200 font-medium">R_n trung bình</span>
                      <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                        {results.rnFinal.toFixed(1)} <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">MPa</span>
                      </div>
                    </div>
                    {results.compressiveDiscarded.length > 0 && (
                      <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-2 rounded">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>Đã loại bỏ mẫu nén vượt quá 15% sai số.</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">Nhập đủ 6 lực nén để tính toán</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
