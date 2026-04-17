import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono selection:bg-[#ff00ff] selection:text-black relative items-center justify-center overflow-x-hidden p-4 md:p-8 uppercase">
      
      {/* CSS Effects Layer */}
      <div className="crt-overlay" />
      <div className="static-noise z-0" />
      
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-8 relative z-10 min-h-screen justify-center pb-20 mt-12 md:mt-0">
        
        {/* Header - Cryptic Terminal UI */}
        <header className="flex flex-col md:flex-row md:items-end gap-6 justify-between border-b-4 border-[#00ffff] pb-4 mb-2 box-glitch">
          <div>
            <h1 className="text-3xl md:text-5xl font-pixel tracking-tighter mb-4 flex items-center gap-4 text-white">
              <Terminal className="w-10 h-10 text-[#ff00ff] animate-pulse hidden sm:block" />
              <span className="glitch-text" data-text="SYS_FAIL">SYS_FAIL</span>
              <span className="text-[#00ffff]">_</span>
              <span className="text-[#ff00ff]">OVR_RIDE</span>
            </h1>
            <p className="text-xl tracking-widest text-[#00ffff]">&gt; INIT_SEQUENCE: GLITCH_ART_PROTOCOL // v.ERR.404</p>
          </div>
          <div className="text-2xl text-[#ff00ff] tracking-widest md:text-right font-bold w-full md:w-auto mt-4 md:mt-0">
             <p className="animate-pulse mb-1">STATUS: CRITICAL ANOMALY</p>
             <p className="text-[#00ffff]">&gt; MODULE: CORRUPTED_SECTOR</p>
          </div>
        </header>

        {/* Core Subsystems Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start w-full justify-center">
          
          {/* Main Executable: Game Panel */}
          <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center p-[2px] border-4 border-[#00ffff] box-glitch relative bg-black shadow-[-8px_8px_0_#ff00ff]">
            <SnakeGame />
          </div>

          {/* Diagnostic Sidebar */}
          <div className="w-full lg:w-64 flex flex-col justify-start gap-8 mt-6">
             
             {/* Input Mappings Board */}
             <div className="p-4 bg-black border-4 border-[#ff00ff] relative box-glitch shadow-[8px_8px_0_#00ffff]">
               <h4 className="text-[#00ffff] font-pixel text-xs mb-6 border-b-2 border-dashed border-[#ff00ff] pb-2">&gt; $ sudo mount input0</h4>
               <ul className="space-y-4 text-2xl">
                 <li className="flex justify-between border-b-2 border-dashed border-zinc-800 pb-1">
                   <span className="text-white">W/UP</span> <span className="text-[#ff00ff]">Y-AXIS[-]</span>
                 </li>
                 <li className="flex justify-between border-b-2 border-dashed border-zinc-800 pb-1">
                   <span className="text-white">A/LF</span> <span className="text-[#ff00ff]">X-AXIS[-]</span>
                 </li>
                 <li className="flex justify-between border-b-2 border-dashed border-zinc-800 pb-1">
                   <span className="text-white">S/DN</span> <span className="text-[#ff00ff]">Y-AXIS[+]</span>
                 </li>
                 <li className="flex justify-between border-b-2 border-dashed border-zinc-800 pb-1">
                   <span className="text-white">D/RT</span> <span className="text-[#ff00ff]">X-AXIS[+]</span>
                 </li>
                 <li className="flex justify-between pt-2">
                   <span className="text-[#00ffff] font-bold underline">SPACE</span> <span className="text-white">HALT_PROC</span>
                 </li>
               </ul>
             </div>
             
             {/* Alert Warning Box */}
             <div className="p-6 bg-black border-4 border-[#00ffff] relative shadow-[4px_4px_0_#ff00ff]">
               <div className="absolute top-0 right-0 w-4 h-full bg-[#ff00ff] animate-pulse" />
               <h4 className="text-white font-pixel text-[10px] mb-4 pl-0 border-b-2 border-[#00ffff] pb-2">&gt; DATA_LEAK DETECTED</h4>
               <p className="opacity-90 pr-4 text-2xl leading-tight">SYSTEM ERROR: AUDIO SUBSYSTEM EXPERIENCING SEVERE DATA DESYNC. PROCEED WITH AUDITORY CAUTION.</p>
             </div>
          </div>
        </div>

        {/* Audio Module */}
        <div className="w-full mt-auto pt-8 relative z-20 box-glitch">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
