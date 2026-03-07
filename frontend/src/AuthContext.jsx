import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        api
            .get("/auth/me/")
            .then((res) => {
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            })
            .catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        const { data } = await api.post("/auth/login/", { username, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const register = async (username, email, password) => {
        const { data } = await api.post("/auth/register/", {
            username,
            email,
            password,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout/");
        } catch {
            // ignore
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
