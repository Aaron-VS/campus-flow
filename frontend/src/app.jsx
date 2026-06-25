import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("cf_user")) || null; }
    catch { return null; }
  });

  const handleLogin = (userData) => {
    sessionStorage.setItem("cf_user", JSON.stringify(userData));
    setUser(userData);
    window.history.pushState({ page: "dashboard", tab: "dashboard" }, "", "/dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cf_user");
    setUser(null);
    window.history.pushState({ page: "login" }, "", "/");
  };

  // Handle browser back/forward between login and dashboard
  useEffect(() => {
    const onPop = (e) => {
      const state = e.state;
      if (!state || state.page === "login") {
        sessionStorage.removeItem("cf_user");
        setUser(null);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (!user) return <Login onLogin={handleLogin} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
