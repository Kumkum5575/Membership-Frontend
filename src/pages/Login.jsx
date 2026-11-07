import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [show,setShow] = useState(false);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(""); setLoading(true);
        try {
            const user = await login(email.trim(), password);
            navigate(user.role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to sign in. Please try again.");
        } finally { setLoading(false); }
    };

    return (
        <main className="auth-page">
            <section className="auth-aside"><div className="auth-aside-content"><span className="eyebrow">MEMBERFLOW PLATFORM</span><h1>Your community.<br/><em>Managed beautifully.</em></h1><p>One secure place to apply, track progress and manage membership.</p><div className="aside-points"><span>✓ Secure invitation access</span><span>✓ Clear application journey</span><span>✓ Timely status updates</span></div></div></section>
            <section className="auth-panel"><div className="auth-card">
                <div className="auth-logo">M</div><p className="auth-kicker">WELCOME BACK</p><h2>Sign in to your account</h2><p className="auth-subtitle">Enter your details to continue to your workspace.</p>
                <form onSubmit={handleSubmit}>
                    <label>Email address</label><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
                    <label>Password</label><div className="password-wrap"><input type={show?"text":"password"} placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/><button type="button" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div>
                    {error && <div className="form-error">{error}</div>}
                    <button className="btn btn-primary auth-submit" disabled={loading}>{loading?"Signing in...":"Sign in"} <span>→</span></button>
                </form>
                <p className="auth-switch">New to MemberFlow? <Link to="/register">Create an account</Link></p>
                <p className="auth-foot">Protected membership access · MemberFlow</p>
            </div></section>
        </main>
    );
}
