import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_BASE = "http://localhost:1000";
const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

const makeImageUrl = (img) => {
  if (!img) return "https://via.placeholder.com/800x800.png?text=Fitness+Gear";
  const value = Array.isArray(img) ? img[0] : img;
  const trimmed = String(value).trim();
  if (!trimmed) return "https://via.placeholder.com/800x800.png?text=Fitness+Gear";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${API_BASE}${trimmed}`;
  return `${API_BASE}/uploads/${trimmed}`;
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(() => location.state?.product || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) return;

    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/products/${id}`, { signal: controller.signal });
        setProduct(res.data?.data ?? res.data ?? null);
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError(err?.response?.data?.message || "Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, product]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return [product.image, ...(Array.isArray(product.gallery) ? product.gallery : [])].filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(Array.isArray(product.sizes) ? product.sizes[0] || "" : "");
    setSelectedColor(Array.isArray(product.colors) ? product.colors[0] || "" : "");
    setSelectedImage(0);
  }, [product]);

  const total = Number(product?.price || 0) * quantity;

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (!product) return;

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer: formData.name,
        email: formData.email,
        phone: formData.phone,
        product: {
          id: product._id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
        items: [
          {
            productId: product._id,
            name: product.name,
            category: product.category,
            image: product.image,
            price: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
          },
        ],
        amount: total,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      };

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await api.post("/api/payments/create-checkout-session", payload, { headers });
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      toast.success("Checkout session created.");
      navigate("/success");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !product) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-orange-400">Loading product...</div>;
  }

  if (error && !product) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-300">{error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/60">Product not found.</div>;
  }

  const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ["One Size"];
  const colors = Array.isArray(product.colors) && product.colors.length ? product.colors : ["Default"];

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <ToastContainer theme="dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl hover:border-orange-500/40 hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <img src={makeImageUrl(gallery[selectedImage] || product.image)} alt={product.name} className="h-[520px] w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  className={`overflow-hidden rounded-2xl border ${selectedImage === index ? "border-orange-500" : "border-white/10"} bg-white/5`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={makeImageUrl(img)} alt={`${product.name} ${index + 1}`} className="h-24 w-full object-cover opacity-85" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">
              <FaShoppingBag /> {product.category}
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">{product.name}</h1>
            <p className="mt-2 text-white/60">
              {product.description || "Premium fitness merchandise built for performance and everyday carry."}
            </p>

            <div className="mt-6 flex items-end gap-4">
              <div className="text-4xl font-black text-orange-400">{currency(product.price)}</div>
              {product.compareAtPrice ? <div className="pb-1 text-white/35 line-through">{currency(product.compareAtPrice)}</div> : null}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                <FaShieldAlt className="mx-auto text-orange-400" />
                <div className="mt-2 text-white/60">Secure checkout</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                <FaTruck className="mx-auto text-orange-400" />
                <div className="mt-2 text-white/60">Fast shipping</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                <FaCheckCircle className="mx-auto text-orange-400" />
                <div className="mt-2 text-white/60">Quality assured</div>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" placeholder="Your name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} />
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" placeholder="Street address" value={formData.street} onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))} />
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" placeholder="City" value={formData.city} onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))} />
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" placeholder="State" value={formData.state} onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))} />
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500 sm:col-span-2" placeholder="ZIP code" value={formData.zipCode} onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-orange-500" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/40">Quantity</div>
                  <div className="mt-1 text-lg font-bold">{quantity}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-xl">
                    -
                  </button>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-xl">
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-orange-100">
                <span className="text-sm uppercase tracking-[0.22em]">Total</span>
                <span className="text-2xl font-black">{currency(total)}</span>
              </div>

              <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-black transition-transform hover:scale-[1.01] disabled:opacity-60">
                <FaCreditCard /> {submitting ? "Processing..." : "Proceed to checkout"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
