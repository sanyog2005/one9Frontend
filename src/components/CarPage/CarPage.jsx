import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBoxOpen, FaSearch, FaShoppingBag, FaStar } from "react-icons/fa";
import axios from "axios";

const BASE = "http://localhost:1000";
const api = axios.create({ baseURL: BASE, headers: { Accept: "application/json" } });

const makeImageUrl = (img) => {
  if (!img) return "https://via.placeholder.com/800x800.png?text=Fitness+Gear";
  const value = Array.isArray(img) ? img[0] : img;
  const trimmed = String(value).trim();
  if (!trimmed) return "https://via.placeholder.com/800x800.png?text=Fitness+Gear";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${BASE}${trimmed}`;
  return `${BASE}/uploads/${trimmed}`;
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const abortRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      abortRef.current?.abort();
    } catch {
      // ignore
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await api.get("/api/products", {
        params: { limit: 12, search },
        signal: controller.signal,
      });
      setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
        setError(err?.response?.data?.message || err.message || "Failed to load merchandise");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => {
      clearTimeout(timer);
      try {
        abortRef.current?.abort();
      } catch {
        // ignore
      }
    };
  }, [search]);

  const featuredCount = useMemo(() => products.filter((product) => product.featured).length, [products]);

  return (
    <main className="relative min-h-screen bg-white text-black">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300">
              <FaShoppingBag /> Fitness merchandise
            </div>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Train hard.
              <span className="block bg-gradient-to-r from-orange-200 via-orange-400 to-amber-600 bg-clip-text text-transparent">
                Shop harder.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Bags, bottles, shoes, and performance essentials for everyday athletes. Browse the latest drops and buy directly from the storefront.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-black/10 bg-black/5 p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">Products live</div>
              <div className="mt-2 text-3xl font-black text-black">{products.length}</div>
            </div>
            <div className="rounded-3xl border border-black/10 bg-black/5 p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">Featured picks</div>
              <div className="mt-2 text-3xl font-black text-orange-400">{featuredCount}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-black/10 bg-black/5 px-4 py-3 backdrop-blur-xl">
            <FaSearch className="text-orange-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-black outline-none placeholder:text-white/35"
              placeholder="Search bags, bottles, shoes, apparel..."
            />
          </div>
          <button
            type="button"
            onClick={fetchProducts}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-black transition-transform hover:scale-[1.01]"
          >
            Refresh catalog <FaArrowRight />
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {loading && <div className="py-24 text-center text-black/60">Loading merchandise...</div>}
        {error && !loading && <div className="py-16 text-center text-red-300">{error}</div>}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-black/10 bg-black/5 py-20 text-center">
            <FaBoxOpen className="mx-auto text-4xl text-orange-400" />
            <h2 className="mt-4 text-2xl font-bold">No products found</h2>
            <p className="mt-2 text-black/50">Add a product in the admin panel to make it appear here.</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const image = makeImageUrl(product.image);
            const displayPrice = currency(product.price);
            const comparePrice = product.compareAtPrice ? currency(product.compareAtPrice) : "";

            return (
              <article key={product._id} className="group overflow-hidden rounded-[2rem] border border-black/10 bg-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  {product.featured && (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">{product.category}</p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-black">{product.name}</h3>
                      <p className="mt-1 text-sm text-black/50">{product.brand || "Arise The Run Club Fitness"}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-black">{displayPrice}</div>
                      {comparePrice && <div className="text-xs text-black/40 line-through">{comparePrice}</div>}
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-black/60">{product.description || "Premium gear built for training, travel, and recovery."}</p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-black/40">Stock {Number(product.stock ?? 0)}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/merchandise/${product._id}`)}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-black"
                    >
                      View product <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
