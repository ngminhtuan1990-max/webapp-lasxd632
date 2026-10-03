import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Filter, RotateCcw, Calculator } from 'lucide-react';

const SIEVE_SIZES = [
  { id: '2.5', name: '2.5 mm', isFMSieve: true },
  { id: '1.25', name: '1.25 mm', isFMSieve: true },
  { id: '0.63', name: '0.63 mm', isFMSieve: true },
  { id: '0.315', name: '0.315 mm', isFMSieve: true },
  { id: '0.14', name: '0.14 mm', isFMSieve: true }
];

const SPECIFICATIONS: Record<string, { lower: number, middle: number, upper: number } | null> = {
  // Bao gộp cho cả Cát thô và Cát mịn (Lượng sót tích lũy %)
  // middle là đường phân ranh giới giữa Cát mịn (dưới) và Cát thô (trên)
  '2.5': { lower: 0, middle: 0, upper: 20 },
  '1.25': { lower: 0, middle: 15, upper: 45 },
  '0.63': { lower: 0, middle: 35, upper: 70 },
  '0.315': { lower: 5, middle: 65, upper: 90 },
  '0.14': { lower: 65, middle: 90, upper: 100 }
};

export default function SandSieveAnalysisTest() {
  const [totalInitialWeight, setTotalInitialWeight] = useState<string>('');
  const [weights, setWeights] = useState<Record<string, string>>({});

  const handleWeightChange = (id: string, value: string) => {
    setWeights(prev => ({ ...prev, [id]: value }));
  };

  const handleClear = () => {
    setWeights({});
    setTotalInitialWeight('');
  };

  const results = useMemo(() => {
    const initialWeight = parseFloat(totalInitialWeight);
    if (isNaN(initialWeight) || initialWeight <= 0) {
      return { table: [], chartData: [], panWeight: 0, finenessModulus: null, error: false, evaluated: false, isAllPass: false };
    }

    const spec = SPECIFICATIONS;
    let sumRetained = 0;
    let cumulativeRetained = 0;
    let sumFMCumulativeRetainedPercent = 0;
    let isAllPass = true;
    let evaluated = false;

    const parsedWeights = SIEVE_SIZES.map(s => {
      const w = parseFloat(weights[s.id]) || 0;
      sumRetained += w;
      return { ...s, w };
    });

    const error = sumRetained > initialWeight;
    const panWeight = Math.max(0, initialWeight - sumRetained);

    const table = parsedWeights.map(s => {
      cumulativeRetained += s.w;
      
      let cumulativeRetainedPercent = (cumulativeRetained / initialWeight) * 100;
      let percentPassing = 100 - cumulativeRetainedPercent;
      
      if (percentPassing < 0) percentPassing = 0;
      if (cumulativeRetainedPercent > 100) cumulativeRetainedPercent = 100;
      
      if (s.isFMSieve) {
        sumFMCumulativeRetainedPercent += cumulativeRetainedPercent;
      }
      
      const retainedFixed = parseFloat(cumulativeRetainedPercent.toFixed(1));
      const limits = spec[s.id];
      let isPass = true;
      let hasLimit = false;

      if (limits !== null) {
        hasLimit = true;
        evaluated = true;
        if (retainedFixed < limits.lower || retainedFixed > limits.upper) {
          isPass = false;
          isAllPass = false;
        }
      }
      
      return {
        id: s.id,
        name: s.name,
        retained: s.w,
        cumulativeRetained,
        cumulativeRetainedPercent: retainedFixed,
        percentPassing: parseFloat(percentPassing.toFixed(1)),
        isFMSieve: s.isFMSieve,
        limits,
        hasLimit,
        isPass
      };
    });

    // Add Pan to the table
    table.push({
      id: 'bottom',
      name: 'Đáy (Pan)',
      retained: parseFloat(panWeight.toFixed(1)),
      cumulativeRetained: initialWeight,
      cumulativeRetainedPercent: 100,
      percentPassing: 0,
      isFMSieve: false
    });

    // Calculate Fineness Modulus
    const finenessModulus = parseFloat((sumFMCumulativeRetainedPercent / 100).toFixed(2));

    // Prepare chart data (exclude bottom, reverse for small to large X-axis)
    const chartData = [...table]
      .filter(s => s.id !== 'bottom')
      .map(s => ({
        size: parseFloat(s.id),
        name: s.name,
        'Bao dưới (Cát mịn)': s.limits ? s.limits.lower : null,
        'Phân giới (Thô/Mịn)': s.limits ? s.limits.middle : null,
        'Bao trên (Cát thô)': s.limits ? s.limits.upper : null,
        'Cấp phối thực tế': s.cumulativeRetainedPercent
      }))
      .sort((a, b) => a.size - b.size);

    return { table, chartData, panWeight, finenessModulus, error, isAllPass: isAllPass && evaluated && !error, evaluated: evaluated && !error };
  }, [weights, totalInitialWeight]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 font-sans">
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700 pb-4">
        <Filter className="w-8 h-8 text-amber-600 dark:text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Thành phần hạt Cát (Cốt liệu nhỏ)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Đánh giá thành phần hạt & Tính Mô đun độ lớn (M_l)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
            <div className="bg-white/40 dark:bg-slate-800/40 border-b border-white/40 dark:border-slate-700/50 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Nhập liệu (g)</h3>
              <button 
                onClick={handleClear}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Xóa toàn bộ số liệu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Tổng khối lượng mẫu ban đầu (g)
                </label>
                <input
                  type="number"
                  value={totalInitialWeight}
                  onChange={(e) => setTotalInitialWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-amber-200/60 dark:border-amber-500/30 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Nhập khối lượng (g)"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Khối lượng giữ lại trên các sàng (g)
                </label>
                {SIEVE_SIZES.map((sieve) => (
                  <div key={sieve.id} className="flex items-center space-x-2">
                    <span className="w-20 text-sm font-medium text-slate-600 dark:text-slate-300">{sieve.name}</span>
                    <input
                      type="number"
                      value={weights[sieve.id] || ''}
                      onChange={(e) => handleWeightChange(sieve.id, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-500/30 rounded-lg shadow-inner backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                      placeholder="0.0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {results.table.length > 0 && !results.error && (
            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 p-4 space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">Mô đun độ lớn (M_l)</h3>
                </div>
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-2">
                  {results.finenessModulus}
                </div>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                  (Tổng lượng sót tích lũy trên các sàng 2.5 đến 0.14 mm chia cho 100)
                </p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1 italic">
                  Ghi chú: Đồ thị thể hiện lượng sót tích lũy. Đường phân giới chia Cát mịn (dưới) và Cát thô (trên).
                </p>
              </div>

              {results.evaluated && (
                <div className="pt-4 border-t border-amber-200/50 dark:border-amber-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Đánh giá cấp phối:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      results.isAllPass 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                    }`}>
                      {results.isAllPass ? 'ĐẠT YÊU CẦU' : 'KHÔNG ĐẠT'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
            <div className="bg-white/40 dark:bg-slate-800/40 border-b border-white/40 dark:border-slate-700/50 p-4">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Kết quả Sàng & Tính toán</h3>
            </div>
            
            {results.error && (
              <div className="m-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <p className="font-medium flex items-center">
                  <RotateCcw className="w-4 h-4 mr-2" /> Lỗi dữ liệu
                </p>
                <p className="text-sm mt-1">Tổng khối lượng trên các sàng lớn hơn khối lượng mẫu ban đầu.</p>
              </div>
            )}

            {!results.error && results.table.length > 0 ? (
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Cỡ sàng</th>
                      <th className="px-4 py-3 font-semibold text-right">Lượng sót riêng (g)</th>
                      <th className="px-4 py-3 font-semibold text-right">Lượng sót tích lũy (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.table.map((row) => (
                      <tr key={row.id} className="border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                          <span>{row.name}</span>
                          {row.isFMSieve && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-semibold" title="Sàng tính Mô đun độ lớn">FM</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300 font-mono">
                          {row.retained.toFixed(1)}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-medium ${row.hasLimit ? (row.isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400') : 'text-slate-600 dark:text-slate-300'}`}>
                          {row.cumulativeRetainedPercent.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <p>Nhập số liệu để xem kết quả tính toán</p>
              </div>
            )}
          </div>

          {!results.error && results.chartData.length > 0 && (
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-white/40 dark:bg-slate-800/40 border-b border-white/40 dark:border-slate-700/50 p-4">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">Biểu đồ thành phần hạt</h3>
              </div>
              <div className="p-4">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis 
                        dataKey="size" 
                        type="number" 
                        scale="log" 
                        domain={[0.14, 2.5]} 
                        tickFormatter={(val) => val.toString()}
                        label={{ value: 'Kích thước lỗ sàng (mm)', position: 'bottom', offset: 0, style: { fill: '#64748b', fontSize: 12 } }}
                        stroke="#94a3b8"
                        fontSize={12}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        label={{ value: 'Lượng sót tích lũy (%)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } }}
                        stroke="#94a3b8"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelFormatter={(label) => `Cỡ sàng: ${label} mm`}
                      />
                      
                      <ReferenceDot x={0.315} y={35} r={0} label={{ position: 'center', value: 'VÙNG CÁT MỊN', fill: '#ef4444', fontSize: 14, fontWeight: 'bold', opacity: 0.7 }} />
                      <ReferenceDot x={0.63} y={52} r={0} label={{ position: 'center', value: 'VÙNG CÁT THÔ', fill: '#ef4444', fontSize: 14, fontWeight: 'bold', opacity: 0.7 }} />

                      <Line 
                        type="monotone" 
                        dataKey="Bao dưới (Cát mịn)" 
                        stroke="#94a3b8" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Phân giới (Thô/Mịn)" 
                        stroke="#64748b" 
                        strokeWidth={2} 
                        strokeDasharray="3 3" 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Bao trên (Cát thô)" 
                        stroke="#94a3b8" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Cấp phối thực tế" 
                        stroke="#d97706" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
