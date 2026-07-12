import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaRunning,
  FaShieldAlt,
  FaTicketAlt,
  FaRoute,
  FaArrowRight,
  FaArrowLeft,
  FaLock,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const NextRunDetails = () => {
  // New States for List vs Detail View
  const [allRuns, setAllRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Simulated Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPass] = useState({ type: "Elite VIP Pass", remainingRuns: 4 });
  const navigate = useNavigate(); // Add this line
  // Fetch ALL data from your backend API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:1000/api/events", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          cache: "no-store",
        });

        const json = await response.json();

        if (json.success && json.data.length > 0) {
          // Sort by targetDate so the soonest events appear first
          const sortedData = json.data.sort(
            (a, b) => new Date(a.targetDate) - new Date(b.targetDate),
          );
          setAllRuns(sortedData);
        } else {
          setError("No active circuits found in the database.");
        }
      } catch (err) {
        console.error("Failed to fetch event data:", err);
        setError("Comm-link failure: Unable to reach mission control.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Live Countdown Timer Logic (Only runs if a specific run is selected)
  useEffect(() => {
    if (!selectedRun || !selectedRun.targetDate) return;

    const target = new Date(selectedRun.targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedRun]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-orange-500 font-mono text-sm uppercase tracking-[0.2em]">
        <span className="animate-pulse">Decrypting Mission Intel...</span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-500 font-mono text-sm uppercase tracking-[0.2em]">
        <span>{error}</span>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: THE DASHBOARD (LIST OF ALL RUNS)
  // ==========================================
  if (!selectedRun) {
    return (
      <div className="relative min-h-screen bg-white text-black py-24 md:py-32 overflow-hidden font-sans selection:bg-orange-500 selection:text-black">
        {/* Background Effects */}
        <div
          className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          }}
        ></div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
                System Online
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-black tracking-tighter uppercase">
              Active Circuits
            </h1>
            <p className="text-black/50 mt-4 max-w-xl">
              Select an upcoming mission node to view classified topography,
              secure your entry, and review syndicate requirements.
            </p>
          </div>

          {/* Runs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRuns.map((run) => (
              <div
                key={run._id}
                onClick={() => setSelectedRun(run)}
                className="group cursor-pointer bg-white border border-black/10 rounded-[2rem] overflow-hidden hover:border-orange-500/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col"
              >
                {/* Card Image */}
                <div className="relative h-56 overflow-hidden bg-white">
                  <img
                    src={run.routeImage}
                    alt={run.title}
                    className="w-full h-full object-cover grayscale-[0.8] opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-black/10 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-black uppercase tracking-widest">
                      {run.spotsRemaining} Spots
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                      {run.title}
                    </h3>
                    <p className="text-orange-500 text-sm font-serif italic mb-4">
                      {run.subtitle}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-3 text-xs text-black/60 font-medium">
                        <FaCalendarAlt className="text-black/30" />
                        <span>
                          {new Date(run.targetDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-black/60 font-medium">
                        <FaMapMarkerAlt className="text-black/30" />
                        <span className="truncate">
                          {run.location.split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/10 mt-auto">
                    <span className="text-xl font-serif italic text-black">
                      ₹{run.price}
                    </span>
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest group-hover:text-orange-500 flex items-center gap-2 transition-colors">
                      Initialize <FaArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE DETAILS PAGE (YOUR EXISTING UI)
  // ==========================================
  return (
    <div className="relative min-h-screen bg-white text-black py-24 md:py-32 overflow-hidden font-sans selection:bg-orange-500 selection:text-black">
      {/* Overlay & Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        }}
      ></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,transparent_60%)] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
        {/* BACK BUTTON */}
        <button
          onClick={() => setSelectedRun(null)}
          className="mb-8 flex items-center gap-2 text-[10px] font-bold text-black/50 uppercase tracking-widest hover:text-orange-500 transition-colors"
        >
          <FaArrowLeft /> Return to Mission Board
        </button>

        {/* --- Top Pass Status Card --- */}
        <div className="mb-12 max-w-8xl justify-center mx-auto">
          {isLoggedIn ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 bg-white border border-orange-500/30 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.1)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-orange-500 bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <FaIdCard />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-1">
                    Active Status
                  </p>
                  <p className="text-lg font-bold uppercase text-black tracking-wide">
                    {userPass.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:border-l border-black/10 sm:pl-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-1">
                    Available Entries
                  </p>
                  <p className="text-2xl font-serif italic text-orange-500 leading-none">
                    {userPass.remainingRuns}{" "}
                    <span className="text-sm font-sans font-bold text-black uppercase not-italic tracking-wider ml-1">
                      Circuits
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 md:p-6 bg-white border border-black/10 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/30">
                  <FaLock />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-black tracking-wide mb-1">
                    Identify Yourself
                  </p>
                  <p className="text-xs font-medium text-black/50 max-w-sm">
                    Login to view your syndicate pass status and automatically
                    apply your remaining entries.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="px-6 py-3 rounded-full border border-black/20 bg-black/5 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-gray-100 hover:text-black transition-colors w-full sm:w-auto text-center"
              >
                Authenticate
              </button>
            </div>
          )}
        </div>

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
                Next Active Circuit
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-black tracking-tighter leading-[0.9] uppercase">
              {selectedRun.title} <br />
              <span className="font-serif italic text-orange-500 font-light normal-case tracking-normal">
                {selectedRun.subtitle}
              </span>
            </h1>
          </div>

          {/* Live Countdown */}
          <div className="flex gap-4 md:pb-2">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="flex flex-col items-center justify-center bg-white border border-black/10 rounded-xl w-16 h-16 md:w-20 md:h-20 shadow-xl"
              >
                <span className="text-2xl md:text-3xl font-serif italic text-black leading-none">
                  {value.toString().padStart(2, "0")}
                </span>
                <span className="text-[8px] md:text-[9px] font-bold text-black/40 uppercase tracking-widest mt-1">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Bento Box Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Visual */}
          <div className="md:col-span-8 relative group rounded-[2rem] bg-white border border-black/10 overflow-hidden h-[400px] md:h-[600px] shadow-2xl">
            <img
              src={selectedRun.routeImage}
              alt="Route"
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.8] opacity-60 group-hover:grayscale-[0.3] group-hover:opacity-80 transition-all duration-700 transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FaRoute className="text-orange-500 w-5 h-5" />
                  <span className="text-xs font-bold text-black uppercase tracking-widest">
                    Route Classified
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-black uppercase tracking-tight">
                  {selectedRun.routeTitle}
                </h3>
                <p className="text-black/60 text-sm font-medium mt-2 max-w-md">
                  {selectedRun.routeDescription}
                </p>
              </div>
              <button className="px-6 py-3 rounded-full border border-black/20 bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-black hover:bg-gray-100 hover:text-black transition-colors">
                View Topography Map
              </button>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-black/10 rounded-[2rem] p-8 shadow-2xl flex-1 hover:border-orange-500/30 transition-colors">
              <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-6">
                Mission Intel
              </h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/50 shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      Rendezvous Point
                    </h5>
                    <p className="text-sm text-black font-medium mt-1">
                      {selectedRun.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/50 shrink-0">
                    <FaClock />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      Start Time
                    </h5>
                    <p className="text-sm text-black font-medium mt-1">
                      {selectedRun.startTimeText}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/50 shrink-0">
                    <FaRunning />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      Distance & Pace
                    </h5>
                    <p className="text-sm text-black font-medium mt-1">
                      {selectedRun.distancePace}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-[2rem] p-8 shadow-2xl hover:border-orange-500/30 transition-colors">
              <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-6">
                Requirements
              </h4>
              <ul className="space-y-3">
                {selectedRun.requirements?.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-black/70 font-medium"
                  >
                    <FaShieldAlt className="text-orange-500 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Bar */}
          <div className="md:col-span-12 bg-white border border-orange-500/30 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border border-orange-500 bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl">
                <FaTicketAlt />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-black uppercase tracking-tight">
                  Secure Your Entry
                </h4>
                <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest mt-1">
                  Only {selectedRun.spotsRemaining} spots remaining in this
                  node.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto">
              {(!isLoggedIn || userPass.remainingRuns === 0) && (
                <div className="text-right hidden sm:block">
                  <span className="block text-[10px] font-bold text-black/40 uppercase tracking-widest">
                    Single Entry
                  </span>
                  <span className="text-3xl font-serif italic text-black">
                    ₹{selectedRun.price}
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  // Navigate to /eventbook and pass the event data instantly
                  navigate("/eventbook", { state: { event: selectedRun } });
                }}
                className="flex-1 md:flex-none group relative inline-flex items-center justify-center gap-3 bg-black hover:bg-orange-500 text-white hover:text-black text-xs font-bold uppercase tracking-widest py-5 px-10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transform hover:-translate-y-1 transition-all duration-500"
              >
                {isLoggedIn && userPass.remainingRuns > 0
                  ? "Use Pass Entry"
                  : "Book Pass"}
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextRunDetails;
