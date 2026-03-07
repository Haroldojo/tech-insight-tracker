import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 80px)",
        padding: 24,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        background: "var(--bg-surface)",
        borderRadius: "var(--radius)",
        padding: 40,
        boxShadow: "var(--shadow)",
        border: "1px solid var(--border)",
    },
    logo: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginBottom: 8,
        fontSize: 22,
        fontWeight: 700,
    },
    icon: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 8,
        background: "linear-gradient(135deg, var(--accent), #a78bfa)",
        fontSize: 18,
    },
    title: {
        textAlign: "center",
        fontSize: 14,
        color: "var(--text-secondary)",
        marginBottom: 32,
    },
    field: { marginBottom: 20 },
    label: {
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-secondary)",
        marginBottom: 6,
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontSize: 14,
        transition: "border-color var(--transition)",
    },
    btn: {
        width: "100%",
        padding: "12px 0",
        background: "var(--accent)",
        color: "#fff",
        border: "none",
        borderRadius: "var(--radius-sm)",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background var(--transition)",
        marginTop: 8,
    },
    error: {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid var(--danger)",
        color: "var(--danger)",
        padding: "10px 14px",
        borderRadius: "var(--radius-sm)",
        fontSize: 13,
        marginBottom: 20,
    },
    footer: {
        textAlign: "center",
        marginTop: 24,
        fontSize: 13,
        color: "var(--text-muted)",
    },
};

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(username, email, password);
            navigate("/");
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const msg = Object.values(data).flat().join(" ");
                setError(msg || "Registration failed.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <form style={styles.card} onSubmit={handleSubmit}>
                <div style={styles.logo}>
                    <span style={styles.icon}>⚡</span>
                    Tech Insight Tracker
                </div>
                <p style={styles.title}>Create your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.field}>
                    <label style={styles.label}>Username</label>
                    <input
                        id="register-username"
                        style={styles.input}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                        id="register-email"
                        style={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Password (min 8 characters)</label>
                    <input
                        id="register-password"
                        style={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                </div>

                <button
                    id="register-submit"
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.btn,
                        opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) =>
                        !loading && (e.target.style.background = "var(--accent-hover)")
                    }
                    onMouseLeave={(e) =>
                        !loading && (e.target.style.background = "var(--accent)")
                    }
                >
                    {loading ? "Creating account…" : "Create Account"}
                </button>

                <p style={styles.footer}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}
