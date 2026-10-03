import React, { useState, useEffect } from 'react';
import SandConeTest from './components/SandConeTest'
import CoreCutterTest from './components/CoreCutterTest'
import SieveAnalysisTest from './components/SieveAnalysisTest'
import SandSieveAnalysisTest from './components/SandSieveAnalysisTest'
import SteelTensileTest from './components/SteelTensileTest'
import ElasticModulusTest from './components/ElasticModulusTest'
import ConcreteCompressiveTest from './components/ConcreteCompressiveTest'
import MortarStrengthTest from './components/MortarStrengthTest'
import ConcreteMixTest from './components/ConcreteMixTest'
import { FlaskConical, Cylinder, Filter, List, Wrench, Activity, Sun, Moon, Box, Layers, Droplet } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('sand-cone');
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 py-8 px-2 md:px-4 relative overflow-hidden font-sans transition-colors duration-500 print:bg-none print:p-0">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-purple-300 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] opacity-40 animate-blob print:hidden"></div>
      <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-300 dark:bg-cyan-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] opacity-40 animate-blob animation-delay-2000 print:hidden"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] opacity-40 animate-blob animation-delay-4000 print:hidden"></div>

      <div className="max-w-4xl mx-auto mb-8 relative z-10 print:hidden">
        
        {/* App Title */}
        <div className="text-center mb-8 relative flex items-center justify-center">
          <div className="flex-1"></div>
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 tracking-tight">
              WEBAPP TÍNH TOÁN THÍ NGHIỆM NỘI BỘ
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Hệ thống tính toán chuyên nghiệp & tự động
              <span className="block mt-1 text-xs uppercase tracking-wider opacity-80">Appweb lưu hành nội bộ</span>
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700/50 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/60 dark:border-slate-700/50">
          <button 
            onClick={() => setActiveTab('sand-cone')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'sand-cone' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-blue-700 dark:text-blue-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <FlaskConical className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Độ chặt (Rót cát)</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('core-cutter')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'core-cutter' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-indigo-700 dark:text-indigo-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Cylinder className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Độ chặt (Dao vòng)</span>
          </button>

          <button 
            onClick={() => setActiveTab('sieve-analysis')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'sieve-analysis' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-emerald-700 dark:text-emerald-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Filter className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Thành phần hạt CPĐD</span>
          </button>

          <button 
            onClick={() => setActiveTab('sand-sieve-analysis')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'sand-sieve-analysis' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-amber-700 dark:text-amber-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <List className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Thành phần hạt Cát</span>
          </button>

          <button 
            onClick={() => setActiveTab('elastic-modulus')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'elastic-modulus' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-sky-700 dark:text-sky-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Activity className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Mô đun đàn hồi</span>
          </button>

          <button 
            onClick={() => setActiveTab('steel-tensile')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'steel-tensile' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-red-700 dark:text-red-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Wrench className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Kéo thép</span>
          </button>

          <button 
            onClick={() => setActiveTab('concrete-compressive')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'concrete-compressive' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-violet-700 dark:text-violet-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Box className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Nén mẫu BT</span>
          </button>

          <button 
            onClick={() => setActiveTab('mortar-strength')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'mortar-strength' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-teal-700 dark:text-teal-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Layers className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Uốn Nén Vữa</span>
          </button>

          <button 
            onClick={() => setActiveTab('concrete-mix')}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center ${
              activeTab === 'concrete-mix' 
                ? 'bg-white/80 dark:bg-slate-700/80 text-cyan-700 dark:text-cyan-400 shadow-md ring-1 ring-white/50 dark:ring-slate-600/50 backdrop-blur-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Droplet className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Cấp Phối Bê Tông</span>
          </button>
        </div>
      </div>
      
      <div className="relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {activeTab === 'sand-cone' && <SandConeTest />}
        {activeTab === 'core-cutter' && <CoreCutterTest />}
        {activeTab === 'sieve-analysis' && <SieveAnalysisTest />}
        {activeTab === 'sand-sieve-analysis' && <SandSieveAnalysisTest />}
        {activeTab === 'elastic-modulus' && <ElasticModulusTest />}
        {activeTab === 'steel-tensile' && <SteelTensileTest />}
        {activeTab === 'concrete-compressive' && <ConcreteCompressiveTest />}
        {activeTab === 'mortar-strength' && <MortarStrengthTest />}
        {activeTab === 'concrete-mix' && <ConcreteMixTest />}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-12 pb-8 flex flex-col items-center">
        <img src="/logo.png" alt="Tứ Hữu Logo" className="h-12 w-auto mb-4 opacity-90 drop-shadow-sm bg-white/40 dark:bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/30 dark:border-white/10" />
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="font-bold text-slate-800 dark:text-slate-200 text-lg uppercase tracking-wide mb-1">
            Công ty TNHH tư vấn kiểm định xây dựng Tứ Hữu
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-base mb-2">
            Phòng thí nghiệm chuyên ngành xây dựng LAS-XD 632
          </p>
          <p className="opacity-80 mt-2">
            Tác giả: <span className="font-medium text-slate-600 dark:text-slate-300">Nguyễn Minh Tuấn</span> • Điện thoại: <a href="tel:0946135156" className="text-blue-600 dark:text-blue-400 hover:underline">0946.135.156</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
