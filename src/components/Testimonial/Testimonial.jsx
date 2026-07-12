// src/components/Testimonial.jsx
import React from 'react';
import { FaStar, FaRunning, FaMapMarkerAlt, FaBolt, FaUsers, FaGlobe } from 'react-icons/fa';
import testimonials from './Testimonialdata'; // Ensure this path matches your project

const Testimonial = () => (
  <div className="relative min-h-screen bg-white text-black py-24 md:py-32 overflow-hidden font-sans selection:bg-orange-500 selection:text-black">
    
    {/* --- Premium Film Grain / Noise Overlay --- */}
    <div 
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03] mix-blend-overlay" 
      style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
    ></div>

    {/* --- Subtle Ambient Orange Glow --- */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15)_0%,transparent_60%)] rounded-full pointer-events-none z-0"></div>

    <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
      
      {/* --- Cinematic Header --- */}
      <div className="flex flex-col items-center text-center mb-20 md:mb-28">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 mb-8 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">The Archives</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold text-black tracking-tighter leading-[0.9] mb-8 uppercase">
          Trusted by <br className="hidden md:block" />
          <span className="text-orange-500 font-serif italic font-light normal-case tracking-normal">Athletes</span>
        </h1>

        <p className="max-w-2xl text-black/50 text-base md:text-lg font-medium leading-relaxed">
          Discover why elite urban runners and high-performance athletes rely on Arise The Run Club for exclusive circuits, premium gear, and an uncompromising community.
        </p>
      </div>

      {/* --- Testimonial Grid (Bento Style) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="group relative flex flex-col h-full bg-[#030303] border border-black/10 rounded-[2rem] p-8 lg:p-10 hover:border-orange-500/50 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(249,115,22,0.1)]"
          >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Quote Watermark */}
            <div className="absolute top-6 right-8 text-7xl text-white/5 font-serif leading-none pointer-events-none group-hover:text-orange-500/10 transition-colors duration-500">
              &rdquo;
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-8 relative z-10">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3.5 h-3.5 ${i < t.rating ? 'text-orange-500' : 'text-black/10'}`}
                />
              ))}
            </div>

            {/* Content */}
            <blockquote className="flex-1 text-black/80 text-lg leading-relaxed font-medium mb-8 relative z-10">
              "{t.comment}"
            </blockquote>

            {/* Divider */}
            <div className="w-full h-px bg-black/10 my-6 relative z-10"></div>

            {/* Author & Location */}
            <div className="flex items-center justify-between mt-auto relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-black/20 group-hover:border-orange-500 flex items-center justify-center bg-transparent group-hover:bg-gray-100 group-hover:text-orange-500 text-black transition-all duration-500 shrink-0 font-serif italic text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-black font-bold text-sm uppercase tracking-wide">{t.name}</h3>
                  <p className="text-[10px] text-black/40 uppercase tracking-[0.2em] font-bold mt-0.5">{t.role}</p>
                </div>
              </div>
              
              {/* Location Tag */}
              <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-black/50 bg-black/5 px-3 py-1.5 rounded border border-black/10 group-hover:border-orange-500/30 group-hover:text-orange-500 transition-all duration-500 backdrop-blur-sm">
                <FaMapMarkerAlt className="w-3 h-3" />
                <span>{t.location || "Global Chapter"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Premium Stats Section --- */}
      <div className="relative rounded-[2rem] bg-white border border-black/10 p-12 overflow-hidden z-10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_100%)] z-0"></div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x-0 md:divide-x divide-white/10">
          {[
            { value: '10K+', label: 'Active Runners', icon: FaUsers },
            { value: '1.5M+', label: 'Collective KM', icon: FaRunning },
            { value: '24/7', label: 'Elite Support', icon: FaBolt },
            { value: '50+', label: 'Global Chapters', icon: FaGlobe },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="mb-6 p-4 rounded-full border border-black/10 text-black/50 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors duration-500 bg-black/50 backdrop-blur-sm">
                <stat.icon size={20} />
              </div>
              <div className="text-4xl md:text-5xl font-serif italic text-black mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] group-hover:text-black/70 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CTA Section --- */}
      <div className="mt-32 text-center reveal-on-scroll">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-black mb-4">
          Ready to Join <span className="font-serif italic text-orange-500 normal-case">The Syndicate?</span>
        </h2>
        <p className="text-black/50 font-medium uppercase tracking-widest text-xs mb-10">
          Join an exclusive network of high-performance runners. Secure your membership today.
        </p>
        
        <a 
          href='/passes' 
          className="inline-flex items-center gap-3 bg-white hover:bg-orange-500 text-black text-xs font-bold uppercase tracking-widest py-5 px-10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transform hover:-translate-y-1 transition-all duration-500"
        >
          <FaRunning className="w-4 h-4" />
          Get Your Pass
        </a>
      </div>

    </div>
  </div>
);

export default Testimonial;