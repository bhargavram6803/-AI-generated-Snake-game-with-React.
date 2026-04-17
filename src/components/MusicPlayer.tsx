import React, { useRef, useState, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'PROC_01', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '06:12' },
  { id: 2, title: 'ERR_STREAM', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '07:05' },
  { id: 3, title: 'VOID_NULL', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '05:44' },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const drawProgressBlocks = () => {
    const totalBlocks = 20;
    const activeBlocks = Math.floor((progress / 100) * totalBlocks);
    let bar = '[';
    for (let i = 0; i < totalBlocks; i++) {
        bar += i < activeBlocks ? '█' : '-';
    }
    bar += ']';
    return bar;
  };

  return (
    <div className="w-full border-glitch-magenta p-4 font-mono text-xl relative">
      <div className="absolute top-0 right-0 bg-[#ff00ff] text-black px-2 py-1 text-sm font-bold uppercase">
        AX_AUDIO_SYS
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        autoPlay={isPlaying}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        
        <div className="flex-1">
          <p className="text-[#00ffff] mb-1">> CURRENT_BUFFER:</p>
          <div className="flex items-center gap-4">
             {isPlaying ? (
                <div className="w-16 h-16 bg-[#ff00ff] flex items-center justify-center font-pixel text-black text-2xl animate-pulse">
                  ON
                </div>
             ) : (
                <div className="w-16 h-16 border-4 border-[#00ffff] flex items-center justify-center font-pixel text-[#00ffff] text-2xl">
                  OFF
                </div>
             )}
             <div>
                <h3 className="font-pixel text-2xl text-white uppercase glitch-magenta" data-text={currentTrack.title}>{currentTrack.title}</h3>
                <p className="text-[#ff00ff] mt-2 text-lg">ID_{currentTrackIndex + 1} // SIZE: UNKNOWN</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
           <div className="flex gap-4 font-pixel text-sm mb-4">
              <button onClick={prevTrack} className="bg-black text-[#00ffff] border-2 border-[#00ffff] hover:bg-[#00ffff] hover:text-black px-3 py-2 cursor-pointer transition-none">&lt;&lt;</button>
              <button onClick={togglePlay} className="bg-[#ff00ff] text-black border-2 border-[#ff00ff] hover:bg-white hover:border-white px-4 py-2 cursor-pointer transition-none">
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button onClick={nextTrack} className="bg-black text-[#00ffff] border-2 border-[#00ffff] hover:bg-[#00ffff] hover:text-black px-3 py-2 cursor-pointer transition-none">&gt;&gt;</button>
           </div>
           
           <div className="text-[#00ffff] text-sm w-full md:w-auto tracking-widest text-left whitespace-pre">
             {drawProgressBlocks()} {Math.floor(progress)}%
           </div>
        </div>
      </div>
    </div>
  );
}
