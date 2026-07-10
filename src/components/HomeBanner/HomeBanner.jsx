import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import img1 from "../../assets/herooo.jpg";

export default function HeroSleek() {
  const wrapRef = useRef(null);
  const bgRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      
      setMouse({ x, y });
      el.style.setProperty("--mx", `${x}`);
      el.style.setProperty("--my", `${y}`);
    }

    function onLeave() {
      setMouse({ x: 0.5, y: 0.5 });
      el.style.setProperty("--mx", `0.5`);
      el.style.setProperty("--my", `0.5`);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchend", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchend", onLeave);
    };
  }, []);

  const maxTranslate = 20; 
  const tx = (mouse.x - 0.5) * 2 * maxTranslate;
  const ty = (mouse.y - 0.5) * 2 * (maxTranslate * 0.55);

  return (
    <div className="relative w-full overflow-hidden bg-black text-white perspective-1000 font-sans selection:bg-orange-500 selection:text-black">
      
      {/* --- Premium Film Grain / Noise Overlay --- */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
      ></div>

      {/* --- Subtle Ambient Orange Glow --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,transparent_60%)] rounded-full pointer-events-none z-0"></div>

      <div
        ref={wrapRef}
        className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden"
        style={{ "--mx": 0.5, "--my": 0.5 }}
      >
        
        {/* 1. BACKGROUND IMAGE LAYER */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0 h-[110%] w-[110%] -left-[5%] -top-[5%]"
          style={{
            transform: `translate3d(${tx * 0.6}px, ${ty * 0.6}px, 0) scale(1.05)`,
            transition: "transform 400ms cubic-bezier(.2,.9,.25,1)",
          }}
        >
          <img
            src={img1}
            alt="Fitness merchandise"
            className="h-full w-full object-cover opacity-60 grayscale-[0.5]"
          />
          {/* Dark Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* 2. ANIMATED SVG LINES (Traffic/Data Flow) - NOW ORANGE */}
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-40 mix-blend-screen"
          viewBox="0 0 1590 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="gFlow" x1="0" x2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 600 C 400 550, 800 500, 1600 550"
            stroke="url(#gFlow)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
           <path
            d="M0 620 C 300 650, 900 680, 1600 600"
            stroke="url(#gFlow)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
            className="animate-pulse"
            style={{ animationDuration: '6s' }}
          />
        </svg>

        {/* 3. MAIN CONTENT CARD */}
        <div 
            className={`relative z-20 mx-4 max-w-5xl w-full transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div 
            className="rounded-[2rem] border border-white/10 bg-[#050505]/80 p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] md:p-12 text-center md:text-left overflow-hidden relative group hover:border-orange-500/30 transition-colors duration-500"
            style={{
                transform: `translate3d(${-tx * 0.2}px, ${-ty * 0.2}px, 0)`,
                transition: "transform 100ms linear",
            }}
          >
            {/* Glossy sheen effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-12">
                
                {/* Text Content */}
                <div className="flex-1 space-y-8">
                    {/* Badge: Premium Orange */}
                    <div className="inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] backdrop-blur-md">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                        </span>
                        Limited Edition Drops
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-[80px] font-bold tracking-tighter text-white uppercase leading-[0.9]">
                        Official <br />
                        <span className="font-serif italic text-orange-500 font-light normal-case tracking-normal">Hardware</span>
                    </h1>

                    <p className="max-w-lg text-sm md:text-base text-white/50 font-medium leading-relaxed">
                        Explore bags, bottles, and training essentials curated for athletes who demand peak performance and uncompromising style.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                         <Link to="/merchandise" className="w-full sm:w-auto">
                            <button className="group relative flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-xs tracking-widest font-bold uppercase text-black transition-all duration-500 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] w-full">
                            Shop Merchandise
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </button>
                         </Link>
                         <Link to="/contact" className="w-full sm:w-auto">
                            <button className="flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-xs tracking-widest font-bold uppercase text-white backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:border-white/40 w-full">
                                Contact
                            </button>
                         </Link>
                    </div>
                </div>

                {/* Interactive Search/Visual Element (Desktop only) */}
                <div className="hidden md:block w-80 shrink-0">
                    <div className="rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent p-[1px] shadow-2xl">
                        <div className="rounded-[2rem] bg-[#030303] p-6 space-y-5 h-full">
                            <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">
                                <span>Search Gear</span>
                                <span className="hover:text-orange-500 transition-colors cursor-pointer">Filter</span>
                            </div>
                            
                            {/* Search Input Mockup */}
                            <div className="flex items-center gap-3 rounded-xl bg-[#0a0a0a] p-3 border border-white/10">
                                <FaSearch className="text-orange-500" />
                                <div className="h-1.5 w-24 rounded bg-white/20 animate-pulse"></div>
                            </div>
                            
                            {/* Map/List items Mockup */}
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                                        <div className="h-10 w-10 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-orange-500 font-serif italic text-sm">0{i}</div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-1.5 w-16 rounded bg-white/40"></div>
                                            <div className="h-1.5 w-10 rounded bg-white/20"></div>
                                        </div>
                                        <div className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Select</div>
                                    </div>
                                ))}
                            </div>
                             <div className="pt-4 border-t border-white/10">
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-2/3"></div>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/40 mt-2">
                                    <span>Syncing Catalog</span>
                                    <span className="text-orange-500">66%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}