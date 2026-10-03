import React, { useState, useMemo } from 'react';
import { Box, Trash2, AlertTriangle, Calculator, FileText, CheckCircle, XCircle } from 'lucide-react';

const ConcreteCompressiveTest = () => {
  const [standard, setStandard] = useState<'TCVN' | 'ASTM'>('TCVN');
  const [specimenType, setSpecimenType] = useState('cube150');
  const [requiredStrength, setRequiredStrength] = useState<number | ''>(25);
  
  const [p1, setP1] = useState<number | ''>('');
  const [p2, setP2] = useState<number | ''>('');
  const [p3, setP3] = useState<number | ''>('');

  const handleStandardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as 'TCVN' | 'ASTM';
    setStandard(val);
    if (val === 'TCVN') {
      setSpecimenType('cube150');
    } else {
      setSpecimenType('cyl150');
    }
  };

  const results = useMemo(() => {
    let area = 0;
    let conversionFactor = 1.0;

    if (specimenType === 'cube70') { area = 70 * 70; conversionFactor = 0.85; }
    else if (specimenType === 'cube100') { area = 100 * 100; conversionFactor = 0.95; }
    else if (specimenType === 'cube150') { area = 150 * 150; conversionFactor = 1.0; }
    else if (specimenType === 'cube200') { area = 200 * 200; conversionFactor = 1.05; }
    else if (specimenType === 'cube250') { area = 250 * 250; conversionFactor = 1.08; }
    else if (specimenType === 'cube300') { area = 300 * 300; conversionFactor = 1.10; }
    else if (specimenType === 'cyl100') { area = (Math.PI * Math.pow(100, 2)) / 4; conversionFactor = 1.16; }
    else if (specimenType === 'cyl150') { area = (Math.PI * Math.pow(150, 2)) / 4; conversionFactor = 1.20; }
    else if (specimenType === 'cyl200') { area = (Math.PI * Math.pow(200, 2)) / 4; conversionFactor = 1.24; }
    else if (specimenType === 'cyl250') { area = (Math.PI * Math.pow(250, 2)) / 4; conversionFactor = 1.26; }
    else if (specimenType === 'cyl300') { area = (Math.PI * Math.pow(300, 2)) / 4; conversionFactor = 1.28; }

    const calcR = (p: number | '') => {
      if (p === '' || p <= 0) return null;
      const rawStrength = (p * 1000) / area;
      return standard === 'TCVN' ? rawStrength * conversionFactor : rawStrength;
    };

    const r1 = calcR(p1);
    const r2 = calcR(p2);
    const r3 = calcR(p3);

    let finalStrength: number | null = null;
    let isTcvnWarning = false;

    if (r1 !== null && r2 !== null && r3 !== null) {
      if (standard === 'TCVN') {
        const sorted = [r1, r2, r3].sort((a, b) => a - b);
        const rMin = sorted[0];
        const rMid = sorted[1];
        const rMax = sorted[2];

        const devMax = ((rMax - rMid) / rMid) * 100;
        const devMin = ((rMid - rMin) / rMid) * 100;

        if (devMax > 15 || devMin > 15) {
          isTcvnWarning = true;
          finalStrength = null;
        } else {
          finalStrength = (r1 + r2 + r3) / 3;
        }
      } else {
        finalStrength = (r1 + r2 + r3) / 3;
      }
    }

    return {
      r1, r2, r3,
      finalStrength,
      isTcvnWarning
    };
  }, [p1, p2, p3, specimenType, standard]);

  const clearData = () => {
    setP1('');
    setP2('');
    setP3('');
  };

  const isPass = (results.finalStrength !== null && requiredStrength !== '') 
    ? results.finalStrength >= requiredStrength 
    : null;

  return (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-white/60 dark:border-slate-700/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Box className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Nén mẫu bê tông
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Tính toán cường độ bê tông theo TCVN 3118 & ASTM C39</p>
        </div>
        <button 
          onClick={clearData}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm"
        >
          <Trash2 className="w-4 h-4" /> Xóa dữ liệu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Tiêu chuẩn & Thông số
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tiêu chuẩn</label>
                <select 
                  value={standard}
                  onChange={handleStandardChange}
                  className="w-full p-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                >
                  <option value="TCVN">TCVN 3118:2022</option>
                  <option value="ASTM">ASTM C39</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kích thước mẫu</label>
                <select 
                  value={specimenType}
                  onChange={(e) => setSpecimenType(e.target.value)}
                  className="w-full p-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                >
                  {standard === 'TCVN' ? (
                    <>
                      <option value="cube70">Lập phương 70x70x70</option>
                      <option value="cube100">Lập phương 100x100x100</option>
                      <option value="cube150">Lập phương 150x150x150</option>
                      <option value="cube200">Lập phương 200x200x200</option>
                      <option value="cube250">Lập phương 250x250x250</option>
                      <option value="cube300">Lập phương 300x300x300</option>
                      <option value="cyl100">Trụ 100x200 mm</option>
                      <option value="cyl150">Trụ 150x300 mm</option>
                      <option value="cyl200">Trụ 200x400 mm</option>
                      <option value="cyl250">Trụ 250x500 mm</option>
                      <option value="cyl300">Trụ 300x600 mm</option>
                    </>
                  ) : (
                    <>
                      <option value="cyl150">Trụ 150x300 mm</option>
                      <option value="cyl100">Trụ 100x200 mm</option>
                    </>
                  )}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cường độ yêu cầu (MPa)</label>
                <input 
                  type="number" 
                  value={requiredStrength}
                  onChange={(e) => setRequiredStrength(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                  placeholder="Vd: 25"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-500" /> Lực phá hoại (kN)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Nhập lực phá hoại cho 3 viên mẫu</p>
            
            {[
              { id: 1, val: p1, setter: setP1, r: results.r1 },
              { id: 2, val: p2, setter: setP2, r: results.r2 },
              { id: 3, val: p3, setter: setP3, r: results.r3 },
            ].map(item => (
              <div key={item.id} className="relative flex items-center">
                <span className="absolute left-3 font-semibold text-slate-400">#{item.id}</span>
                <input 
                  type="number" 
                  value={item.val}
                  onChange={(e) => item.setter(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-10 pr-24 p-3 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:text-slate-100 font-medium"
                  placeholder="0.0"
                />
                {item.r !== null && (
                  <span className="absolute right-3 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {item.r.toFixed(1)} MPa
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-1 relative overflow-hidden shadow-lg h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-8 -mb-8"></div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 sm:p-8 relative z-10 flex flex-col h-full">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-between">
                <span>Kết quả tính toán</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-full uppercase tracking-wider">
                  {standard}
                </span>
              </h3>
              
              {results.isTcvnWarning ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                  <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex flex-col items-center gap-3 w-full">
                    <XCircle className="w-10 h-10 text-red-500 mb-2" />
                    <h4 className="text-lg font-bold text-red-700 dark:text-red-400">Tổ mẫu không hợp lệ</h4>
                    <p className="text-sm text-red-600 dark:text-red-300/90 leading-relaxed font-medium">
                      Giá trị lớn nhất hoặc nhỏ nhất lệch quá 15% so với giá trị cường độ viên còn lại. Theo TCVN 3118:2022, không tính toán cường độ chịu nén của tổ mẫu.
                    </p>
                  </div>
                </div>
              ) : results.finalStrength !== null ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col items-center justify-center py-6">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">
                      Cường độ nén trung bình
                    </p>
                    <div className="text-5xl sm:text-6xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2 flex items-baseline gap-2">
                      {results.finalStrength.toFixed(1)}
                      <span className="text-2xl text-slate-400 dark:text-slate-500 font-semibold">MPa</span>
                    </div>
                    
                    {isPass !== null && (
                      <div className={`mt-6 flex items-center gap-2 px-4 py-2 rounded-xl border ${
                        isPass 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                      }`}>
                        {isPass ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span className="font-semibold">
                          {isPass ? 'ĐẠT YÊU CẦU' : 'KHÔNG ĐẠT'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-12">
                  <Calculator className="w-16 h-16 mb-4 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400 text-center font-medium">
                    Nhập đủ 3 lực phá hoại để<br />xem kết quả
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcreteCompressiveTest;
