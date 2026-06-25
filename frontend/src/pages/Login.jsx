import React, { useState } from "react";

const FEATURES = [
  { icon: "🧠", text: "AI Academic Assistant" },
  { icon: "📊", text: "Attendance Risk Alerts" },
  { icon: "📋", text: "Smart Deadline Manager" },
  { icon: "💬", text: "WhatsApp Reminders" },
];

export default function Login({ onLogin }) {
  const [mode, setMode]               = useState("signin"); // "signin" | "signup"
  const [form, setForm]               = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused]         = useState("");
  const [strength, setStrength]       = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    if (name === "password") setStrength(calcStrength(value));
  };

  const calcStrength = (p) => {
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#F59E0B", "#10B981", "#10B981"];

  const validateSignIn = () => {
    if (!form.email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const validateSignUp = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!/^[+]?[\d\s\-()]{7,15}$/.test(form.phone.trim())) return "Enter a valid phone number.";
    if (!form.email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = mode === "signin" ? validateSignIn() : validateSignUp();
    if (err) { setError(err); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "signup") {
        setSuccess("Account created! Signing you in…");
        setTimeout(() => onLogin?.({ email: form.email, name: form.name || form.email.split("@")[0], phone: form.phone }), 1000);
      } else {
        onLogin?.({ email: form.email, name: form.email.split("@")[0] });
      }
    }, 1200);
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setSuccess("");
    setForm({ name: "", email: "", phone: "", password: "", confirm: "" });
    setStrength(0);
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14, color: "#0F172A",
    border: `2px solid ${focused === field ? "#2563EB" : error && !form[field] ? "#FECACA" : "#E2E8F0"}`,
    outline: "none", transition: "border 0.2s", background: "#fff", boxSizing: "border-box",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{ flex: 1, background: "#1E293B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(37,99,235,0.2)", top: -60, left: -60, animation: "blob 8s infinite ease-in-out" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(16,185,129,0.15)", bottom: 40, right: -40, animation: "blob 10s infinite ease-in-out reverse" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "slideUp 0.6s ease" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(37,99,235,0.4)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-1px" }}>CampusFlow</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, margin: "0 0 48px", lineHeight: 1.6 }}>Your smart student<br/>productivity platform</p>

          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.1)", animation: `slideUp ${0.5 + i * 0.1}s ease` }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, overflowY: "auto" }}>
        <div style={{ width: "100%", animation: "slideUp 0.5s ease" }}>

          {/* Mode toggle tabs */}
          <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 14, padding: 4, marginBottom: 32, gap: 4 }}>
            {["signin", "signup"].map((m) => (
              <button key={m} onClick={() => switchMode(m)} type="button"
                style={{ flex: 1, padding: "10px", borderRadius: 11, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.25s",
                  background: mode === m ? "#fff" : "transparent",
                  color: mode === m ? "#0F172A" : "#94A3B8",
                  boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.10)" : "none",
                }}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>
            {mode === "signin" ? "Welcome back 👋" : "Join CampusFlow 🚀"}
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>
            {mode === "signin" ? "Sign in to access your dashboard" : "Create your student account — it's free"}
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Name field — signup only */}
            {mode === "signup" && (
              <div style={{ marginBottom: 18, animation: "slideUp 0.25s ease" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                  placeholder="e.g. Ann Mary Johnson"
                  style={inputStyle("name")}
                />
              </div>
            )}


            {/* Phone field — signup only */}
            {mode === "signup" && (
              <div style={{ marginBottom: 18, animation: "slideUp 0.25s ease" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>📱</div>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                    placeholder="+91 98765 43210"
                    style={{ ...inputStyle("phone"), paddingLeft: 42 }}
                  />
                </div>
                <div style={{ fontSize:11, color:"#94A3B8", marginTop:5 }}>Used for WhatsApp reminders &amp; account recovery</div>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>College Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                placeholder="you@college.edu"
                style={inputStyle("email")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: mode === "signup" ? 10 : 8 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} value={form.password}
                  onChange={handleChange} onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  placeholder="Enter your password"
                  style={{ ...inputStyle("password"), paddingRight: 56 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Strength bar — signup only */}
              {mode === "signup" && form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= strength ? strengthColor[strength] : "#E2E8F0", transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: strengthColor[strength] }}>{strengthLabel[strength]}</div>
                </div>
              )}
            </div>

            {/* Confirm password — signup only */}
            {mode === "signup" && (
              <div style={{ marginBottom: 18, animation: "slideUp 0.25s ease" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input name="confirm" type={showConfirm ? "text" : "password"} value={form.confirm}
                    onChange={handleChange} onFocus={() => setFocused("confirm")} onBlur={() => setFocused("")}
                    placeholder="Re-enter your password"
                    style={{
                      ...inputStyle("confirm"), paddingRight: 56,
                      border: `2px solid ${form.confirm && form.password !== form.confirm ? "#EF4444" : form.confirm && form.password === form.confirm ? "#10B981" : focused === "confirm" ? "#2563EB" : "#E2E8F0"}`,
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                  {form.confirm && (
                    <div style={{ position: "absolute", right: 52, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>
                      {form.password === form.confirm ? "✅" : "❌"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Forgot password — signin only */}
            {mode === "signin" && (
              <div style={{ textAlign: "right", marginBottom: 24, marginTop: 4 }}>
                <button type="button" style={{ background: "none", border: "none", color: "#2563EB", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Forgot password?</button>
              </div>
            )}

            {/* Terms — signup only */}
            {mode === "signup" && (
              <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 18, lineHeight: 1.6 }}>
                By creating an account you agree to our{" "}
                <button type="button" style={{ background:"none", border:"none", color:"#2563EB", cursor:"pointer", fontSize:12, fontWeight:600, padding:0 }}>Terms of Service</button>
                {" "}and{" "}
                <button type="button" style={{ background:"none", border:"none", color:"#2563EB", cursor:"pointer", fontSize:12, fontWeight:600, padding:0 }}>Privacy Policy</button>.
              </p>
            )}

            {/* Error */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#EF4444", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#10B981", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
                ✅ {success}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: 12, background: loading ? "#93C5FD" : "#2563EB", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = "#1D4ED8")}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = "#2563EB")}
            >
              {loading ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white"/>
                  </svg>
                  {mode === "signin" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                mode === "signin" ? "Sign in →" : "Create account →"
              )}
            </button>

            {/* Switch mode link */}
            <div style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "#64748B" }}>
              {mode === "signin" ? "New student? " : "Already have an account? "}
              <button type="button" onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                style={{ background: "none", border: "none", color: "#2563EB", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </div>
          </form>

          <p style={{ textAlign: "center", fontSize: 12, color: "#CBD5E1", marginTop: 36 }}>CampusFlow · CampusAI Hackathon 2025</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blob { 0%,100%{transform:scale(1) translate(0,0);} 33%{transform:scale(1.1) translate(20px,-10px);} 66%{transform:scale(0.95) translate(-10px,15px);} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
      `}</style>
    </div>
  );
}
