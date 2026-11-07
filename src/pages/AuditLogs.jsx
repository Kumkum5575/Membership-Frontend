import { useEffect, useState } from "react";
import axios from "axios";

import { getAuthHeaders } from "../context/AuthContext";
import Loader from "../components/Loader";

import "./DataPages.css";

const API = import.meta.env.VITE_API_URL;

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch audit logs
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    `${API}/audit-logs`,
                    {
                        headers: getAuthHeaders()
                    }
                );

                setLogs(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {
                console.error("Audit Logs Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Could not load audit logs"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    // Loading state
    if (loading) {
        return <Loader />;
    }

    return (
        <main className="data-page">

            {/* Page Heading */}
            <div className="data-heading">
                <div>
                    <span className="eyebrow">
                        ADMIN WORKSPACE
                    </span>

                    <h1>Audit Logs</h1>

                    <p>
                        A timeline of administrative actions
                        for accountability.
                    </p>
                </div>
            </div>

            {/* Audit Logs Section */}
            <section className="data-card">

                <div className="data-card-title">
                    <h2>Recent Activity</h2>

                    <span className="result-count">
                        {logs.length} events
                    </span>
                </div>

                {/* Error State */}
                {error ? (
                    <p className="data-empty">
                        {error}
                    </p>
                ) : logs.length === 0 ? (

                    /* Empty State */
                    <p className="data-empty">
                        No activity recorded yet.
                    </p>

                ) : (

                    /* Audit Logs List */
                    <div className="audit-list">

                        {logs.map((log) => (
                            <article
                                className="audit-item"
                                key={log._id}
                            >
                                <span className="audit-dot"></span>

                                <div>
                                    <strong>
                                        {log.action?.replaceAll("_", " ") ||
                                            "Activity"}
                                    </strong>

                                    <p>
                                        {log.details || "No additional details"}
                                    </p>

                                    <small>
                                        {log.admin?.name || "Admin"}
                                        {" · "}

                                        {log.createdAt
                                            ? new Date(
                                                log.createdAt
                                            ).toLocaleString()
                                            : "Date unavailable"}
                                    </small>
                                </div>
                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}