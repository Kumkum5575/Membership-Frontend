import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./Admin.css";

const API = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [sort, setSort] = useState("NEWEST");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const load = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const [response] = await Promise.all([
                axios.get(`${API}/admin/applications`, {
                    headers: getAuthHeaders()
                }),
                isRefresh
                    ? new Promise(resolve => setTimeout(resolve, 700))
                    : Promise.resolve()
            ]);

            setApps(response.data);
        } catch (e) {
            setError(
                e.response?.data?.message ||
                "Unable to load applications."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        load(false);
    }, []);

    const action = async (id, type, value) => {
        const config = {
            approve: {
                url: "approve",
                confirm: "Approve this application?"
            },
            reject: {
                url: "reject",
                confirm: "Reject this application?"
            },
            review: {
                url: "review",
                confirm: "Move this application under review?"
            },
            suspend: {
                url: `members/${id}/suspend`,
                confirm: "Suspend this member?"
            },
            reactivate: {
                url: `members/${id}/reactivate`,
                confirm: "Reactivate this member?"
            }
        };

        if (
            type !== "priority" &&
            !window.confirm(config[type].confirm)
        ) {
            return;
        }

        try {
            if (type === "priority") {
                await axios.put(
                    `${API}/admin/priority/${id}`,
                    { priority: value },
                    { headers: getAuthHeaders() }
                );
            } else if (
                type === "suspend" ||
                type === "reactivate"
            ) {
                await axios.put(
                    `${API}/admin/${config[type].url}`,
                    {},
                    { headers: getAuthHeaders() }
                );

                setSuccess(
                    type === "suspend"
                        ? "Member suspended successfully."
                        : "Member reactivated successfully."
                );
            } else {
                await axios.put(
                    `${API}/admin/${config[type].url}/${id}`,
                    {},
                    { headers: getAuthHeaders() }
                );

                setSuccess("Application updated successfully.");
            }

            await load(true);

        }  catch (e) {
        setError(
        e.response?.data?.message ||
        "Action could not be completed."
    );
}
    };

    const count = (status) =>
        apps.filter(
            a => a.applicationStatus === status
        ).length;

    const visible = apps
        .filter(a => {
            const q = search.toLowerCase();

            const matches =
                (a.user?.name || "").toLowerCase().includes(q) ||
                (a.user?.email || "").toLowerCase().includes(q);

            return (
                matches &&
                (filter === "ALL" ||
                    a.applicationStatus === filter)
            );
        })
        .sort((a, b) => {
            if (sort === "PRIORITY") {
                const priorityOrder = {
                    Critical: 1,
                    High: 2,
                    Medium: 3,
                    Low: 4
                };

                return (
                    (priorityOrder[a.priority] || 5) -
                    (priorityOrder[b.priority] || 5)
                );
            }

            if (sort === "OLDEST") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }

            if (sort === "NEWEST") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            return 0;
        });

    if (loading) {
        return <Loader text="Loading admin workspace..." />;
    }

    return (
        <main className="admin-workspace">

            <div className="admin-heading">
                <div>
                    <span className="eyebrow">
                        ADMIN WORKSPACE
                    </span>

                    <h1>Good day, Admin</h1>

                    <p>
                        Here's what's happening with your membership applications.
                    </p>
                </div>

                <button
                    className="admin-refresh"
                    onClick={() => load(true)}
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "↻ Refresh data"}
                </button>
            </div>

            {refreshing && (
                <p style={{
                    color: "#6b7280",
                    marginBottom: "15px"
                }}>
                    Updating dashboard...
                </p>
            )}

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-success">
                    {success}
                    <button
                        onClick={() => setSuccess("")}
                        style={{
                            marginLeft: "12px",
                            cursor: "pointer"
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <section className="metric-grid">

                <Metric
                    label="Total applications"
                    value={apps.length}
                    icon="▤"
                    tone="blue"
                />

                <Metric
                    label="Pending review"
                    value={count("PENDING")}
                    icon="◷"
                    tone="amber"
                />

                <Metric
                    label="Under Review"
                    value={count("UNDER_REVIEW")}
                    icon="◉"
                    tone="blue"
                />

                <Metric
                    label="Approved members"
                    value={count("APPROVED")}
                    icon="✓"
                    tone="green"
                />

                <Metric
                    label="Rejected"
                    value={count("REJECTED")}
                    icon="×"
                    tone="red"
                />

            </section>

            <section className="admin-panel">

                <div className="admin-panel-head">
                    <div>
                        <h2>Membership applications</h2>

                        <p>
                            Review applicants and manage their application status.
                        </p>
                    </div>

                    <span className="result-count">
                        {visible.length} records
                    </span>
                </div>

                <div className="admin-toolbar">

                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search applicant or email..."
                    />

                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="ALL">All statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        <option value="NEWEST">Newest first</option>
                        <option value="OLDEST">Oldest first</option>
                        <option value="PRIORITY">Priority order</option>
                    </select>

                </div>

                {visible.length === 0 ? (
                    <div className="admin-empty">
                        No applications match your search.
                    </div>
                ) : (
                    <div className="application-list">

                        {visible.map(a => (
                            <article
                                className="admin-app-card"
                                key={a._id}
                            >

                                <div className="app-avatar">
                                    {(a.user?.name || "M")
                                        .slice(0, 1)
                                        .toUpperCase()}
                                </div>

                                <div className="app-main">

                                    <div className="app-title-row">

                                        <div>
                                            <h3>
                                                {a.user?.name || "Unknown member"}
                                            </h3>

                                            <p>
                                                {a.user?.email || "No email"}
                                            </p>
                                        </div>

                                        <Status
                                            value={a.applicationStatus}
                                        />

                                    </div>

                                    <div className="app-meta">

                                        <span>
                                            Invitation:{" "}
                                            <b>
                                                {a.invitation?.code || "—"}
                                            </b>
                                        </span>

                                        <span>
                                            Priority:{" "}
                                            <b>{a.priority || "Low"}</b>
                                        </span>

                                        <span>
                                            Applied:{" "}
                                            <b>
                                                {a.createdAt
                                                    ? new Date(
                                                        a.createdAt
                                                    ).toLocaleDateString()
                                                    : "—"}
                                            </b>
                                        </span>

                                        <span>
                                            Account Status:{" "}
                                            <b>
                                                {a.user?.accountStatus || "Unknown"}
                                            </b>
                                        </span>

                                    </div>

                                    <div className="app-actions">

                                        <label>
                                            Priority

                                            <select
                                                value={a.priority || "Low"}
                                                onChange={e =>
                                                    action(
                                                        a._id,
                                                        "priority",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>Critical</option>
                                                <option>High</option>
                                                <option>Medium</option>
                                                <option>Low</option>
                                            </select>
                                        </label>

                                        <button
                                            className="mini-btn review"
                                            disabled={[
                                                "APPROVED",
                                                "REJECTED"
                                            ].includes(a.applicationStatus)}
                                            onClick={() =>
                                                action(a._id, "review")
                                            }
                                        >
                                            Review
                                        </button>

                                        <button
                                            className="mini-btn approve"
                                            disabled={[
                                                "APPROVED",
                                                "REJECTED"
                                            ].includes(a.applicationStatus)}
                                            onClick={() =>
                                                action(a._id, "approve")
                                            }
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="mini-btn reject"
                                            disabled={[
                                                "APPROVED",
                                                "REJECTED"
                                            ].includes(a.applicationStatus)}
                                            onClick={() =>
                                                action(a._id, "reject")
                                            }
                                        >
                                            Reject
                                        </button>

                                        {a.user?.accountStatus === "ACTIVE" && (
                                            <button
                                                className="mini-btn reject"
                                                onClick={() =>
                                                    action(
                                                        a.user._id,
                                                        "suspend"
                                                    )
                                                }
                                            >
                                                Suspend
                                            </button>
                                        )}

                                        {a.user?.accountStatus === "SUSPENDED" && (
                                            <button
                                                className="mini-btn approve"
                                                onClick={() =>
                                                    action(
                                                        a.user._id,
                                                        "reactivate"
                                                    )
                                                }
                                            >
                                                Reactivate
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}



function Metric({ label, value, icon, tone }) {
    return (
        <article className="metric-card">

            <span className={`metric-icon ${tone}`}>
                {icon}
            </span>

            <div>
                <p>{label}</p>
                <strong>{value}</strong>
            </div>

        </article>
    );
}


function Status({ value }) {
    return (
        <span className={`admin-status ${value?.toLowerCase()}`}>
            {(value || "").replace("_", " ")}
        </span>
    );
}