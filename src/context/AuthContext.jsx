import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem("user")) || null; }
        catch { return null; }
    });

    const login = async (email, password) => {
        const response = await axios.post(`${API}/auth/login`, { email, password });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        return response.data.user;
    };

    const register = async (details) => {
        const response = await axios.post(`${API}/auth/register`, details);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export const API_URL = API;
export const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
});
