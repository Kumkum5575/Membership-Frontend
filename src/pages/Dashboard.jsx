import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./Workspace.css";
import GenerateInvitation from "../components/GenerateInvitation";
const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const [application, setApplication] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [appRes, noticeRes] = await Promise.all([
                    axios.get(
                        `${API}/member/my-application`,
                        { headers: getAuthHeaders() }
                    ),
                    axios.get(
                        `${API}/notifications`,
                        { headers: getAuthHeaders() }
                    )
                ]);

                setApplication(appRes.data.application);

                setNotifications(
                    Array.isArray(noticeRes.data)
                        ? noticeRes.data
                        : []
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Could not load your membership details."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return <Loader text="Loading your membership..." />;
    }

    if (error) {
        return (
            <main className="workspace">
                <div className="alert-error">{error}</div>
            </main>
        );
    }

    const status = application?.applicationStatus || "PENDING";

    const steps = ["PENDING", "UNDER_REVIEW", "APPROVED"];

    return (
        <main className="workspace">

            <div className="workspace-heading">
                <div>
                    <span className="eyebrow">MEMBER SPACE</span>
                    <h1>Your membership</h1>
                    <p>Track your application and stay up to date with the team.</p>
                </div>

                <span className={`pill ${status.toLowerCase()}`}>
                    {status.replace("_", " ")}
                </span>
            </div>

            <section className="member-hero-card">
                <div>
                    <span className="card-kicker">APPLICATION OVERVIEW</span>

                    <h2>
                        {status === "APPROVED"
                            ? "You're in. Welcome aboard!"
                            : status === "REJECTED"
                                ? "Application update"
                                : "Your application is in progress"}
                    </h2>

                    <p>
                        {status === "APPROVED"
                            ? "Your membership has been approved. You can now access your member space."
                            : status === "REJECTED"
                                ? "Your application was not approved. Please contact the administrator if you need more information."
                                : "Your application has been received. The membership team will review it and notify you of any updates."}
                    </p>
                </div>

                <div className="hero-symbol">✦</div>
            </section>

            <div className="member-grid">

                {/* APPLICATION JOURNEY */}

                <section className="panel">

                    <div className="panel-heading">
                        <div>
                            <h3>Application journey</h3>
                            <p>Follow each stage of your application.</p>
                        </div>
                    </div>

                    <div className="journey">

                        {steps.map((step, index) => {
                            const current = steps.indexOf(status);

                            const done =
                                status === "APPROVED" || index < current;

                            const active = step === status;

                            return (
                                <div
                                    className={`journey-step ${done ? "complete" : ""} ${active ? "selected" : ""}`}
                                    key={step}
                                >
                                    <span className="journey-icon">
                                        {done ? "✓" : index + 1}
                                    </span>

                                    <div>
                                        <strong>
                                            {step === "PENDING"
                                                ? "Submitted"
                                                : step === "UNDER_REVIEW"
                                                    ? "Under review"
                                                    : "Decision"}
                                        </strong>

                                        <small>
                                            {step === "PENDING"
                                                ? "Application received"
                                                : step === "UNDER_REVIEW"
                                                    ? "Being assessed by the team"
                                                    : "Final membership decision"}
                                        </small>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* APPLICATION DETAILS */}

                <section className="panel">

                    <div className="panel-heading">
                        <div>
                            <h3>Application details</h3>
                            <p>Your submitted membership information.</p>
                        </div>
                    </div>

                    <div className="detail-row">
                        <span>Application status</span>
                        <strong>{status.replace("_", " ")}</strong>
                    </div>

                    <div className="detail-row">
                        <span>Priority</span>
                        <strong>{application?.priority || "Low"}</strong>
                    </div>

                    <div className="detail-row">
                        <span>Invitation code</span>
                        <strong>{application?.invitation?.code || "—"}</strong>
                    </div>

                    <div className="detail-row">
                        <span>Submitted</span>
                        <strong>
                            {application?.createdAt
                                ? new Date(application.createdAt).toLocaleDateString()
                                : "—"}
                        </strong>
                    </div>

                    {/* ADMIN NOTES */}

                    <div className="detail-row admin-notes-row">
                        <span>Admin Notes</span>

                        <strong>
                            {application?.adminNotes?.trim()
                                ? application.adminNotes
                                : "No notes added by admin."}
                        </strong>
                    </div>

                </section>

            </div>
            {/* GENERATE INVITATION */}
            {status === "APPROVED" && (
            <GenerateInvitation />
            )}

            {/* RECENT UPDATES */}

            <section className="panel notification-panel">

                <div className="panel-heading">
                    <div>
                        <h3>Recent updates</h3>
                        <p>Messages from your membership team.</p>
                    </div>

                    <span className="count-badge">
                        {notifications.length}
                    </span>
                </div>

                {notifications.length === 0 ? (
                    <p className="muted">
                        No updates yet. We'll show notifications here.
                    </p>
                ) : (
                    notifications.slice(0, 4).map((n) => (
                        <div className="notice-row" key={n._id}>

                            <span className="notice-icon">✦</span>

                            <div>
                                <strong>{n.message}</strong>

                                <small>
                                    {new Date(n.createdAt).toLocaleString()}
                                </small>
                            </div>

                            <span className={n.isRead ? "read-label" : "unread-label"}>
                                {n.isRead ? "Read" : "New"}
                            </span>

                        </div>
                    ))
                )}

            </section>

        </main>
    );
}