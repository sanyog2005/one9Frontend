import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import PaytmCheckout from '../../components/PaytmCheckout/PaytmCheckout';

const Memberships = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paytmData, setPaytmData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/passes');
        const data = await res.json();
        if (data.success) {
          setPasses(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to load memberships.");
      } finally {
        setLoading(false);
      }
    };
    fetchPasses();
  }, []);

  const handleBuy = async (passId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const email = user ? user.email : '';

    if (!email) {
        alert("User email not found. Please log in again.");
        return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('http://localhost:1000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 0, email, metadata: { passId } })
      });
      const data = await res.json();
      
      if (data.txnToken) {
        setPaytmData({
          txnToken: data.txnToken,
          orderId: data.orderId,
          mid: data.mid,
          amount: 0 // Amount handled by backend
        });
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Failed to initialize payment.");
      }
    } catch (err) {
      alert("Transaction failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
    {paytmData && <PaytmCheckout {...paytmData} onClose={() => setPaytmData(null)} />}
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-500 selection:text-black flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">
              Acquire <span className="text-orange-500">Access</span>
            </h1>
            <p className="text-black/50 max-w-2xl mx-auto text-sm md:text-base font-medium">
              Purchase a membership to gain entry to our exclusive circuits. Pick the tier that fits your objective.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20 text-orange-500 font-mono text-sm uppercase animate-pulse">
              Decrypting Tier Access...
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-500 font-mono text-sm py-20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!loading && !error && passes.map((pass, index) => (
              <div 
                key={pass._id} 
                className="bg-white p-8 rounded-3xl border border-black/10 flex flex-col hover:border-orange-500/50 transition-colors duration-300 relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-b from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:to-orange-500/0 rounded-[2rem] -z-10 transition-all duration-500"></div>
                
                <div className="mb-8">
                  <div className="text-orange-500 font-mono text-xs mb-2">{`0${index + 1} / ${pass.title.split(' ')[0]}`}</div>
                  <h2 className="text-3xl font-bold uppercase tracking-tight">{pass.title}</h2>
                  <p className="text-black/40 text-sm mt-1 italic">{pass.subtitle || 'Membership'}</p>
                </div>

                <div className="mb-8">
                  <div className="text-5xl font-bold">₹{pass.price}</div>
                  <div className="text-black/40 text-xs mt-2 uppercase tracking-widest">
                    {pass.runsIncluded} Runs Included • {pass.validityWeeks > 0 ? `Valid for ${pass.validityWeeks} weeks` : 'Lifetime Access'}
                  </div>
                </div>

                <ul className="space-y-4 mb-12 flex-1">
                  {pass.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-black/70">
                      <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleBuy(pass._id)}
                  disabled={isProcessing}
                  className="w-full bg-white text-black hover:bg-orange-500 hover:text-black py-4 rounded-xl font-bold uppercase tracking-widest transition-colors duration-300 flex justify-center items-center gap-2"
                >
                  {isProcessing ? <FaSpinner className="animate-spin" /> : 'Acquire Access'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Memberships;
