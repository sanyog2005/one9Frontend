// src/components/ContactPage.jsx
import React, { useState } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCar,
  FaComment,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', carType: '', message: '' });
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage =
      `Name: ${formData.name}%0A` +
      `Email: ${formData.email}%0A` +
      `Phone: ${formData.phone}%0A` +
      `Car Type: ${formData.carType}%0A` +
      `Message: ${formData.message}`;
    window.open(`https://wa.me/+919560231025?text=${whatsappMessage}`, '_blank');

    setFormData({ name: '', email: '', phone: '', carType: '', message: '' });
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-sans text-white py-24 md:py-32 flex flex-col items-center selection:bg-orange-500 selection:text-black">
      
      {/* --- Premium Film Grain / Noise Overlay --- */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03] mix-blend-overlay" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
      ></div>

      {/* --- Subtle Ambient Orange Glow --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15)_0%,transparent_60%)] rounded-full pointer-events-none z-0"></div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 md:px-12 flex flex-col items-center">
        
        {/* Cinematic Header */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Contact Desk</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold text-white tracking-tighter leading-[0.9] uppercase">
             Get In <br className="hidden md:block" />
             <span className="text-orange-500 font-serif italic font-light normal-case tracking-normal">Touch</span>
          </h1>
          
          <p className="text-white/50 max-w-2xl text-base md:text-lg mx-auto font-medium leading-relaxed mt-6">
            Have questions about parking spots or long-term leases? Our support team is ready to assist you instantly.
          </p>
        </div>

        {/* Card Grid (Bento Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full max-w-6xl mx-auto">
          
          {/* LEFT: Info Card (2 columns wide) */}
          <div className="lg:col-span-2 relative bg-[#030303] border border-white/10 rounded-[2rem] p-8 lg:p-10 overflow-hidden shadow-2xl group hover:border-orange-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 space-y-10 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-orange-500 bg-black">
                   <FaMapMarkerAlt className="w-4 h-4" /> 
                </div>
                Contact Info
              </h2>

              <div className="space-y-4">
                {[
                  { icon: FaWhatsapp, label: 'WhatsApp', value: '+91 999' },
                  { icon: FaEnvelope, label: 'Email', value: 'contact@me.com' },
                  { icon: FaClock, label: 'Hours', value: 'Mon-Sat: 8AM-8PM' },
                ].map((info, i) => (
                  <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-orange-500 transition-colors">
                      <info.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{info.label}</h3>
                      <p className="text-white text-sm font-medium">
                        {info.value}
                        {i === 2 && <span className="block text-white/30 text-[10px] mt-1 uppercase tracking-wider">Sunday: 10AM-6PM</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Offer Box */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <FaCalendarAlt className="text-orange-500" />
                  <span className="font-bold text-orange-500 text-xs uppercase tracking-widest">Monthly Pass Deal</span>
                </div>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Book a spot for 3+ months and get a 10% discount on your first billing cycle.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Form Card (3 columns wide) */}
          <div className="lg:col-span-3 relative bg-[#050505] border border-white/10 rounded-[2rem] p-8 lg:p-12 shadow-2xl overflow-hidden group hover:border-orange-500/30 transition-colors duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_100%)] z-0"></div>
            
            <div className="relative z-10 mb-10">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wide flex items-center gap-4">
                Send Inquiry
                <IoIosSend className="text-orange-500 w-6 h-6" /> 
              </h2>
              <p className="text-white/40 text-sm font-medium mt-3">Fill out the form and we'll get back to you promptly via WhatsApp.</p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs Loop */}
                {['name', 'email', 'phone'].map((field) => {
                  const icons = { name: FaUser, email: FaEnvelope, phone: FaPhone, carType: FaCar };
                  const placeholders = { name: 'Full Name', email: 'Email Address', phone: 'Phone Number', carType: 'Vehicle Type' };
                  
                  return (
                    <div key={field} className="relative group/input">
                      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${activeField === field ? 'text-orange-500' : 'text-white/30 group-hover/input:text-white/50'}`}>
                        {React.createElement(icons[field], { className: "w-4 h-4" })}
                      </div>

                      {field !== 'carType' ? (
                        <input
                          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field)}
                          onBlur={handleBlur}
                          required
                          placeholder={placeholders[field]}
                          className={`w-full bg-[#0a0a0a] rounded-xl px-5 py-4 pl-12 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 ${
                            activeField === field 
                              ? 'border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                              : 'border border-white/10 hover:border-white/20'
                          }`}
                        />
                      ) : (
                        <div className="relative">
                            {/* <select
                            name="carType"
                            value={formData.carType}
                            onChange={handleChange}
                            onFocus={() => handleFocus(field)}
                            onBlur={handleBlur}
                            required
                            className={`w-full bg-[#0a0a0a] rounded-xl px-5 py-4 pl-12 text-sm outline-none appearance-none cursor-pointer transition-all duration-300 ${
                                activeField === field 
                                ? 'border border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                                : formData.carType === '' ? 'border border-white/10 text-white/30 hover:border-white/20' : 'border border-white/10 text-white hover:border-white/20'
                            }`}
                            >
                            <option value="" disabled hidden>Select Vehicle</option>
                            {["Premium", "Affordable", "Moderate", "Economy", "Luxury"].map((opt) => (
                                <option key={opt} value={opt} className="bg-[#0a0a0a] text-white">
                                {opt}
                                </option>
                            ))}
                            </select> */}
                            {/* Custom Dropdown Arrow */}
                            {/* <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div> */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Message Area */}
              <div className="relative group/input">
                <div className={`absolute left-5 top-5 transition-colors duration-300 ${activeField === 'message' ? 'text-orange-500' : 'text-white/30 group-hover/input:text-white/50'}`}>
                  <FaComment className="w-4 h-4" />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={handleBlur}
                  required
                  rows="4"
                  placeholder="Tell us about your requirements..."
                  className={`w-full bg-[#0a0a0a] rounded-xl px-5 py-4 pl-12 text-sm text-white placeholder-white/30 outline-none resize-none transition-all duration-300 ${
                    activeField === 'message'
                      ? 'border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                      : 'border border-white/10 hover:border-white/20'
                  }`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-white hover:bg-orange-500 text-black font-bold uppercase tracking-widest text-xs py-5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transform hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 mt-4"
              >
                Send via WhatsApp
                <FaWhatsapp className="text-lg" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;