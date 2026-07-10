import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaStar, FaShoppingBag } from "react-icons/fa";
import axios from "axios";

const HomeCars = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const base = "http://localhost:1000";
  const api = axios.create({ baseURL: base, headers: { Accept: "application/json" } });

  useEffect(() => {
    fetchProducts();
    return () => {
      try { abortRef.current?.abort(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try { abortRef.current?.abort(); } catch {}
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await api.get("/api/products", { params: { limit: 4, featured: true }, signal: ctrl.signal });
      setProducts(res.data?.data || []);
    } catch (err) {
      if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
        setError(err?.response?.data?.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  const featured = useMemo(() => {
    const highlighted = products.filter((product) => product.featured);
    return highlighted.length ? highlighted : products;
  }, [products]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 bg-black">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">
            <FaShoppingBag /> Featured picks
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-white">Best selling fitness gear</h2>
        </div>
        <button type="button" onClick={() => navigate("/merchandise")} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-orange-500 hover:bg-orange-500 hover:text-black">
          Browse all <FaArrowRight className="text-xs" />
        </button>
      </div>

      {loading && <div className="py-12 text-center text-white/60">Loading featured products...</div>}
      {error && <div className="py-12 text-center text-red-300">{error}</div>}

      {!loading && !error && featured.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 py-16 text-center text-white/55">Add featured products in admin to highlight them here.</div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {featured.map((product) => (
          <article key={product._id} className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/30 hover:-translate-y-1">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={product.image ? `${base}/uploads/${product.image}` : "https://via.placeholder.com/600x750.png?text=Fitness+Gear"} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black"><FaStar /> Featured</div>
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">{product.category}</p>
              <h3 className="mt-2 text-xl font-bold text-white">{product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-white/55">{product.description}</p>
              <button type="button" onClick={() => navigate(`/merchandise/${product._id}`)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-orange-500 hover:bg-orange-500 hover:text-black">
                View product <FaArrowRight className="text-xs" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomeCars;