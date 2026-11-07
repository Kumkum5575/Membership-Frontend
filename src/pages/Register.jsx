import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, API_URL } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState("register");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
        company: "",
        experience: "",
        invitationCode: ""
    });

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // MEMBERSHIP REGISTRATION
    const submitRegistration = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const result = await register({
                ...form,
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                designation: form.designation.trim(),
                company: form.company.trim(),
                experience: form.experience.trim(),
                invitationCode: form.invitationCode.trim().toUpperCase()
            });

            setSuccess(
                result.message ||
                "Registration submitted. Waiting for admin approval."
            );

            setTimeout(() => navigate("/login"), 1800);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please check your details."
            );
        } finally {
            setLoading(false);
        }
    };

    // ACCESS REQUEST WITHOUT INVITATION
    const submitAccessRequest = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/access-requests`,
                {
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase()
                }
            );

            setSuccess(response.data.message);

            setForm({
                name: "",
                email: "",
                password: "",
                phone: "",
                designation: "",
                company: "",
                experience: "",
                invitationCode: ""
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Access request failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setError("");
        setSuccess("");
    };

    return (
        <main className="auth-page register-page">

            <section className="auth-aside">
                <div className="auth-aside-content">

                    <span className="eyebrow">
                        JOIN THE COMMUNITY
                    </span>

                    <h1>
                        Good things
                        <br />
                        <em>start with an invite.</em>
                    </h1>

                    <p>
                        Use your invitation code to submit a membership
                        application. Don't have an invitation? You can
                        request access separately.
                    </p>

                    <div className="aside-points">
                        <span>✓ Invitation-verified registration</span>
                        <span>✓ Application status tracking</span>
                        <span>✓ Secure member account</span>
                    </div>

                </div>
            </section>

            <section className="auth-panel">
                <div className="auth-card">

                    <div className="auth-logo">M</div>

                    <p className="auth-kicker">
                        {mode === "register"
                            ? "CREATE YOUR ACCOUNT"
                            : "REQUEST ACCESS"}
                    </p>

                    <h2>
                        {mode === "register"
                            ? "Join MemberFlow"
                            : "Get Access to MemberFlow"}
                    </h2>

                    <p className="auth-subtitle">
                        {mode === "register"
                            ? "Fill in your details and invitation code."
                            : "Submit your details. Our team can review your request."}
                    </p>

                    <form
                        onSubmit={
                            mode === "register"
                                ? submitRegistration
                                : submitAccessRequest
                        }
                    >

                        <label>Full name</label>
                        <input
                            name="name"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={change}
                            required
                        />

                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={change}
                            required
                        />

                        {mode === "register" && (
                            <>

                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={change}
                                    required
                                />

                                <label>Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="e.g. Software Developer"
                                    value={form.designation}
                                    onChange={change}
                                    required
                                />

                                <label>Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="Enter your company name"
                                    value={form.company}
                                    onChange={change}
                                    required
                                />

                                <label>Experience</label>
                                <input
                                    type="text"
                                    name="experience"
                                    placeholder="e.g. Fresher or 2 years"
                                    value={form.experience}
                                    onChange={change}
                                    required
                                />

                                <label>Password</label>

                                <div className="password-wrap">
                                    <input
                                        type={show ? "text" : "password"}
                                        name="password"
                                        placeholder="At least 6 characters"
                                        value={form.password}
                                        onChange={change}
                                        minLength="6"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                    >
                                        {show ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <label>Invitation code</label>
                                <input
                                    name="invitationCode"
                                    placeholder="Enter your invitation code"
                                    value={form.invitationCode}
                                    onChange={change}
                                    required
                                />

                            </>
                        )}

                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="form-success">
                                {success}
                            </div>
                        )}

                        <button
                            className="btn btn-primary auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Please wait..."
                                : mode === "register"
                                    ? "Submit application"
                                    : "Submit access request"}

                            <span>→</span>
                        </button>

                    </form>

                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "20px"
                        }}
                    >

                        {mode === "register" ? (
                            <p>
                                Don't have an invitation code?
                                <br />

                                <button
                                    type="button"
                                    onClick={() => switchMode("access")}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#2563eb",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        marginTop: "8px"
                                    }}
                                >
                                    Request Access
                                </button>
                            </p>
                        ) : (
                            <p>
                                Have an invitation code?
                                <br />

                                <button
                                    type="button"
                                    onClick={() => switchMode("register")}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#2563eb",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        marginTop: "8px"
                                    }}
                                >
                                    Register with Invitation
                                </button>
                            </p>
                        )}

                    </div>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>

                    <p className="auth-foot">
                        Your information is handled securely.
                    </p>

                </div>
            </section>

        </main>
    );
}