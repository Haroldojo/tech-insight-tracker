import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    return !user ? children : <Navigate to="/" replace />;
}

function LoadingScreen() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "var(--bg-primary)",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        border: "3px solid var(--border)",
                        borderTopColor: "var(--accent)",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 16px",
                    }}
                />
                <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}

function Navbar() {
    const { user, logout } = useAuth();
    if (!user) return null;

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 32px",
                background: "var(--bg-surface)",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <a
                href="/"
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "linear-gradient(135deg, var(--accent), #a78bfa)",
                        fontSize: 16,
                    }}
                >
                    ⚡
                </span>
                Tech Insight Tracker
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    {user.username}
                </span>
                <button
                    onClick={logout}
                    style={{
                        padding: "8px 16px",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 13,
                        fontWeight: 500,
                        transition: "all var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = "var(--danger)";
                        e.target.style.color = "var(--danger)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = "var(--border)";
                        e.target.style.color = "var(--text-secondary)";
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <ProjectList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/:id"
                    element={
                        <ProtectedRoute>
                            <ProjectDetail />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}
