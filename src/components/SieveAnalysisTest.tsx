import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Layers, RotateCcw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const SIEVE_SIZES = [
  { id: '50', name: '50 mm' },
  { id: '37.5', name: '37.5 mm' },
  { id: '25', name: '25.0 mm' },
  { id: '19', name: '19.0 mm' },
  { id: '9.5', name: '9.5 mm' },
  { id: '4.75', name: '4.75 mm' },
  { id: '2.36', name: '2.36 mm' },
  { id: '0.425', name: '0.425 mm' },
  { id: '0.075', name: '0.075 mm' }
];

const SPECIFICATIONS: Record<string, Record<string, { lower: number, upper: number } | null>> = {
  'CPĐD-37.5': {
    '50': { lower: 100, upper: 100 },
    '37.5': { lower: 95, upper: 100 },
    '25': null,
    '19': { lower: 58, upper: 78 },
    '9.5': { lower: 39, upper: 59 },
    '4.75': { lower: 24, upper: 39 },
    '2.36': { lower: 15, upper: 30 },
    '0.425': { lower: 7, upper: 19 },
    '0.075': { lower: 2, upper: 12 }
  },
  'CPĐD-25': {
    '50': null,
    '37.5': { lower: 100, upper: 100 },
    '25': { lower: 79, upper: 90 },
    '19': { lower: 67, upper: 83 },
    '9.5': { lower: 49, upper: 64 },
    '4.75': { lower: 34, upper: 54 },
    '2.36': { lower: 25, upper: 40 },
    '0.425': { lower: 12, upper: 24 },
    '0.075': { lower: 2, upper: 12 }
  },
  'CPĐD-19': {
    '50': null,
    '37.5': null,
    '25': { lower: 100, upper: 100 },
    '19': { lower: 90, upper: 100 },
    '9.5': { lower: 58, upper: 73 },
    '4.75': { lower: 39, upper: 59 },
    '2.36': { lower: 30, upper: 45 },
    '0.425': { lower: 13, upper: 27 },
    '0.075': { lower: 2, upper: 12 }
  }
};

export default function SieveAnalysisTest() {
  const [materialType, setMaterialType] = useState('CPĐD-25');
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
      return { table: [], chartData: [], panWeight: 0, error: false, isAllPass: false, evaluated: false };
    }

    const spec = SPECIFICATIONS[materialType];
    let sumRetained = 0;
    let cumulativeRetained = 0;
    let isAllPass = true;
    let evaluated = false; // At least one spec checked

    const parsedWeights = SIEVE_SIZES.map(s => {
      const w = parseFloat(weights[s.id]) || 0;
      sumRetained += w;
      return { ...s, w };
    });

    const error = sumRetained > initialWeight;
    const panWeight = Math.max(0, initialWeight - sumRetained);

    const table = parsedWeights.map(s => {
      cumulativeRetained += s.w;
      let percentPassing = 100 - (cumulativeRetained / initialWeight) * 100;
      if (percentPassing < 0) percentPassing = 0;
      
      const passingFixed = parseFloat(percentPassing.toFixed(1));
      const limits = spec[s.id];
      
      let isPass = true;
      let hasLimit = false;

      if (limits !== null) {
        hasLimit = true;
        evaluated = true;
        if (passingFixed < limits.lower || passingFixed > limits.upper) {
          isPass = false;
          isAllPass = false;
        }
      }
      
      return {
        id: s.id,
        name: s.name,
        retained: s.w,
        cumulativeRetained,
        percentPassing: passingFixed,
        limits,
        hasLimit,
        isPass
      };
    });

    // Add Pan to the table for display purposes
    table.push({
      id: 'bottom',
      name: 'Đáy (Pan)',
      retained: panWeight,
      cumulativeRetained: initialWeight,
      percentPassing: 0,
      limits: null,
      hasLimit: false,
      isPass: true
    });

    // Prepare chart data (exclude bottom, reverse for small to large X-axis)
    const chartData = [...table]
      .filter(s => s.id !== 'bottom')
      .map(s => ({
        size: parseFloat(s.id),
        name: s.name,
        'Cận dưới': s.limits ? s.limits.lower : null,
        'Cận trên': s.limits ? s.limits.upper : null,
        'Thực tế': s.percentPassing
      }))
      .sort((a, b) => a.size - b.size);

    return { table, chartData, panWeight, error, isAllPass: isAllPass && evaluated && !error, evaluated: evaluated && !error };
  }, [weights, totalInitialWeight, materialType]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 font-sans">
      <div className="flex items-center space-x-2 border-b pb-4">
        <Layers className="w-8 h-8 text-emerald-600" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Thí nghiệm Thành phần hạt Cấp phối đá dăm (CPĐD)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Section */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Loại Cấp phối đá dăm</label>
              <select 
                value={materialType}
                onChange={e => setMaterialType(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
              >
                <option value="CPĐD-37.5" className="dark:bg-slate-800">CPĐD-37.5</option>
                <option value="CPĐD-25" className="dark:bg-slate-800">CPĐD-25</option>
                <option value="CPĐD-19" className="dark:bg-slate-800">CPĐD-19</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Tổng KL mẫu ban đầu (g)</label>
              <input 
                type="number" 
                value={totalInitialWeight}
                onChange={e => setTotalInitialWeight(e.target.value)}
                placeholder="VD: 5000"
                className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-700/50 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-2 border-b pb-2">
              <h2 className="font-semibold text-slate-700 dark:text-slate-200">Khối lượng sót trên sàng (g)</h2>
              <button 
                onClick={handleClear}
                className="flex items-center space-x-1 text-sm text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Xóa</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {SIEVE_SIZES.map(sieve => {
                const hasRequirement = SPECIFICATIONS[materialType][sieve.id] !== null;
                return (
                  <div key={sieve.id} className={`flex items-center justify-between p-1.5 rounded ${hasRequirement ? 'bg-emerald-50/50' : ''}`}>
                    <label className={`text-sm w-24 ${hasRequirement ? 'font-semibold text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      {sieve.name}
                    </label>
                    <input 
                      type="number" 
                      value={weights[sieve.id] || ''}
                      onChange={(e) => handleWeightChange(sieve.id, e.target.value)}
                      placeholder="0"
                      className="w-32 px-3 py-1.5 border bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded focus:ring-2 focus:ring-emerald-500 outline-none transition text-right text-sm"
                    />
                  </div>
                );
              })}
            </div>

            <div className={`pt-4 border-t flex justify-between items-center ${results.error ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>
              <span className="font-semibold">Khối lượng Đáy (tính):</span>
              <span className="font-bold">{results.panWeight.toFixed(1)} g</span>
            </div>
            {results.error && (
              <div className="text-xs text-red-500 dark:text-red-400 flex items-center mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Tổng KL sót trên sàng vượt quá KL mẫu ban đầu!
              </div>
            )}
          </div>
        </div>

        {/* Results & Chart Section */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Chart */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-xl h-[400px]">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">Biểu đồ đường cong cấp phối ({materialType})</h2>
            {results.evaluated ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="size" 
                    type="number" 
                    scale="log"
                    domain={[0.075, 50]}
                    ticks={[0.075, 0.425, 2.36, 4.75, 9.5, 19, 25, 37.5, 50]}
                    tickFormatter={(val) => val.toString()}
                    tick={{ fontSize: 11 }} 
                    angle={-45} 
                    textAnchor="end" 
                    height={60} 
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} label={{ value: '% Lọt qua', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <Tooltip labelFormatter={(label) => `Cỡ sàng: ${label} mm`} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="linear" dataKey="Thực tế" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                  <Line type="linear" dataKey="Cận trên" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                  <Line type="linear" dataKey="Cận dưới" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
                <Layers className="w-12 h-12 text-gray-200" />
                <p>Nhập Tổng khối lượng mẫu ban đầu để hiển thị biểu đồ</p>
              </div>
            )}
          </div>

          {/* Data Table */}
          {results.evaluated && (
            <div className="bg-white rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-100 dark:border-slate-700/50">
                    <tr>
                      <th className="px-4 py-3">Cỡ sàng</th>
                      <th className="px-4 py-3 text-right">KL Sót (g)</th>
                      <th className="px-4 py-3 text-right">Lọt sàng (%)</th>
                      <th className="px-4 py-3 text-center">Yêu cầu (%)</th>
                      <th className="px-4 py-3 text-center">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.table.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:bg-slate-800/80 transition-colors">
                        <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">{row.name}</td>
                        <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-300">{row.retained.toFixed(1)}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${row.hasLimit ? (row.isPass ? 'text-emerald-600' : 'text-red-500 dark:text-red-400') : 'text-slate-500 dark:text-slate-400'}`}>
                          {row.percentPassing.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-center text-slate-500 dark:text-slate-400">
                          {row.hasLimit && row.limits ? `${row.limits.lower} - ${row.limits.upper}` : '-'}
                        </td>
                        <td className="px-4 py-2 flex justify-center">
                          {row.hasLimit ? (
                            row.isPass ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className={`p-4 border-t font-bold text-center flex items-center justify-center space-x-2 ${results.isAllPass ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-500/30' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-500/30'}`}>
                {results.isAllPass ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>KẾT LUẬN: THÀNH PHẦN HẠT ĐẠT YÊU CẦU</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    <span>KẾT LUẬN: THÀNH PHẦN HẠT KHÔNG ĐẠT</span>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
