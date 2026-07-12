import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaIdCard,
  FaFileSignature,
  FaQrcode,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PaytmCheckout from '../PaytmCheckout/PaytmCheckout';

const API_BASE = "http://localhost:1000";
const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const EventBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // We look for 'event' in state, but fallback to fetching if they navigated directly via URL
  const [eventData, setEventData] = useState(() => location.state?.event || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Runner-specific registration fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alias: "", // Optional Syndicate Alias
    emergencyContact: "",
    emergencyPhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [activePass, setActivePass] = useState(null);
  const [paytmData, setPaytmData] = useState(null);

  useEffect(() => {
    const fetchPass = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get("/api/passes/my-pass", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success && res.data?.data) {
          setActivePass(res.data.data);
        }
      } catch (err) {}
    };
    fetchPass();
  }, []);

  // Fetch event data if not passed through routing state
  useEffect(() => {
    if (eventData) return;

    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/events/${id}`, { signal: controller.signal });
        setEventData(res.data?.data ?? res.data ?? null);
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError(err?.response?.data?.message || "Failed to locate mission node.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, eventData]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!eventData) return;

    if (!formData.name || !formData.email || !formData.phone || !formData.emergencyContact || !formData.emergencyPhone) {
      toast.error("All mandatory intel fields must be completed.");
      return;
    }

    setSubmitting(true);
    try {
      // Adjusted payload for event ticketing
      const payload = {
        customer: formData.name,
        email: formData.email,
        phone: formData.phone,
        metadata: {
          alias: formData.alias || "Unknown",
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          eventId: eventData._id,
          eventTitle: eventData.title
        },
        items: [
          {
            productId: eventData._id, // Using event ID as the product ID for the payment gateway
            name: `Node Entry: ${eventData.title}`,
            category: "Event Ticket",
            image: eventData.routeImage,
            price: eventData.price,
            quantity: 1, // Force 1 ticket per registration for accountability
          },
        ],
        amount: eventData.price,
      };

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await api.post("/api/payments/create-checkout-session", payload, { headers });
      
      if (res?.data?.txnToken) {
        setPaytmData({
          txnToken: res.data.txnToken,
          orderId: res.data.orderId,
          mid: res.data.mid,
          amount: payload.amount
        });
        return;
      } else if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      toast.success("Comm-link established. Proceeding to gateway.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Transaction failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !eventData) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-orange-500 font-mono text-sm uppercase tracking-[0.2em] animate-pulse">Decrypting parameters...</div>;
  }

  if (error && !eventData) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-red-500 font-mono text-sm uppercase">{error}</div>;
  }

  if (!eventData) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-black/60 font-mono">Mission not found.</div>;
  }

  return (
    <>
    {paytmData && <PaytmCheckout {...paytmData} onClose={() => setPaytmData(null)} />}
    <div className="relative min-h-screen bg-white text-black py-24 md:py-32 selection:bg-orange-500 selection:text-black">
      <ToastContainer theme="dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        
        {/* Back Navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-6 py-2 text-xs font-bold uppercase tracking-widest text-black/50 backdrop-blur-xl hover:border-orange-500 hover:text-black transition-colors"
        >
          <FaArrowLeft /> Abort Registration
        </button>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          
          {/* --- LEFT COLUMN: MISSION SUMMARY --- */}
          <section className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl relative">
              <img src={eventData.routeImage} alt={eventData.title} className="h-[400px] w-full object-cover grayscale-[0.5] opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-4 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Circuit Locked
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">{eventData.title}</h1>
                <p className="text-orange-500 font-serif italic text-lg mt-1">{eventData.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
                <FaCalendarAlt className="text-orange-500 text-xl mb-3" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/50">Target Date</h3>
                <p className="text-sm font-medium mt-1">{new Date(eventData.targetDate).toLocaleString()}</p>
              </div>
              <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
                <FaMapMarkerAlt className="text-orange-500 text-xl mb-3" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/50">Rendezvous</h3>
                <p className="text-sm font-medium mt-1">{eventData.location}</p>
              </div>
            </div>
          </section>

          {/* --- RIGHT COLUMN: REGISTRATION FORM --- */}
          <section className="rounded-[2rem] border border-black/10 bg-white p-8 md:p-10 shadow-2xl">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Operative Registration</h2>
            <p className="mt-2 text-sm text-black/50 font-medium">
              Submit your intel to secure a node entry. All fields except Alias are mandatory.
            </p>

            {/* Badges */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-black/10 bg-white p-4 text-center hover:border-orange-500/30 transition-colors">
                <FaIdCard className="mx-auto text-orange-500 text-lg" />
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/60">ID Verified</div>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-4 text-center hover:border-orange-500/30 transition-colors">
                <FaFileSignature className="mx-auto text-orange-500 text-lg" />
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/60">Auto-Waiver</div>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-4 text-center hover:border-orange-500/30 transition-colors">
                <FaQrcode className="mx-auto text-orange-500 text-lg" />
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/60">Secure Gateway</div>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="mt-10 space-y-6">
              
              {/* Runner Intel */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-4 border-b border-black/10 pb-2">Primary Intel</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="Legal Name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
                  <input className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="Syndicate Alias (Optional)" value={formData.alias} onChange={(e) => setFormData((prev) => ({ ...prev, alias: e.target.value }))} />
                  <input required type="email" className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors sm:col-span-2" placeholder="Secure Comm-Link (Email)" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
                  <input required className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors sm:col-span-2" placeholder="Primary Contact Number" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} />
                </div>
              </div>

              {/* Emergency Intel */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-4 border-b border-black/10 pb-2 mt-8">Emergency Extraction</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="Emergency Contact Name" value={formData.emergencyContact} onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))} />
                  <input required className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="Emergency Phone Number" value={formData.emergencyPhone} onChange={(e) => setFormData((prev) => ({ ...prev, emergencyPhone: e.target.value }))} />
                </div>
              </div>

              {/* Price & Submit */}
              <div className="pt-6 border-t border-black/10 mt-8">
                {eventData.isPassEligible !== false ? (
                  <>
                    {activePass ? (
                      <div className="flex items-center justify-between rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-4 mb-6 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                          {activePass.passId?.title || 'Membership Pass'} Active
                        </span>
                        <span className="text-lg font-serif italic text-black">
                          {activePass.runsRemaining} {activePass.runsRemaining === 1 ? 'Run' : 'Runs'} Remaining
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 mb-6 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                        <span className="text-xs font-bold uppercase tracking-widest text-red-500">No Active Membership Found</span>
                        <button 
                          type="button"
                          onClick={() => navigate('/memberships')}
                          className="text-xs font-bold bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-red-400"
                        >
                          Acquire Pass
                        </button>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={submitting || !activePass} 
                      className="w-full flex items-center justify-center gap-3 rounded-full bg-orange-500 hover:bg-gray-100 text-black px-6 py-5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <FaCheckCircle className="text-lg" /> 
                      {submitting ? "Decrypting Pass..." : !activePass ? "Membership Required" : "Book Mission (Use 1 Run)"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-4 mb-6 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                      <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Special Event Fee</span>
                      <span className="text-3xl font-serif italic text-black">{currency(eventData.price)}</span>
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full flex items-center justify-center gap-3 rounded-full bg-orange-500 hover:bg-gray-100 text-black px-6 py-5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <FaCheckCircle className="text-lg" /> 
                      {submitting ? "Initializing Gateway..." : "Initialize Registration"}
                    </button>
                  </>
                )}
              </div>

            </form>
          </section>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventBookingPage;