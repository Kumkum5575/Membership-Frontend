import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./DataPages.css";

const API = import.meta.env.VITE_API_URL;

export default function Applications() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [sort, setSort] = useState("NEWEST");

   
    const load = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await axios.get(
                `${API}/admin/applications`,
                {
                    headers: getAuthHeaders()
                }
            );

            if (!Array.isArray(response.data)) {
                throw new Error("Invalid applications response");
            }

            setItems(response.data);

        } catch (error) {
            console.error("Applications error:", error);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Could not load applications"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    
    const handleRefresh = () => {
        if (!refreshing) {
            load(true);
        }
    };

   
    const visible = items
        .filter((item) => {
            const name = (
                item.user?.name || ""
            ).toLowerCase();

            const email = (
                item.user?.email || ""
            ).toLowerCase();

            const q = query.trim().toLowerCase();

            const matchesSearch =
                name.includes(q) || email.includes(q);

            const matchesFilter =
                filter === "ALL" ||
                item.applicationStatus === filter;

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sort === "NEWEST") {
                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );
            }

            if (sort === "OLDEST") {
                return (
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
                );
            }

            const order = {
                Critical: 1,
                High: 2,
                Medium: 3,
                Low: 4
            };

            return (
                (order[a.priority] || 5) -
                (order[b.priority] || 5)
            );
        });

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

                    <h1>Applications</h1>

                    <p>
                        Search, filter and review membership requests.
                    </p>
                </div>

                <button
                    type="button"
                    className="data-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? "Refreshing..." : "↻ Refresh"}
                </button>
            </div>

            {refreshing && (
                <p
                    style={{
                        color: "#6b7280",
                        marginBottom: "15px"
                    }}
                >
                    Updating applications...
                </p>
            )}

            {/* Applications Table */}
            <section className="data-card">

                <div className="data-tools">

                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All statuses</option>
                        <option value="PENDING">PENDING</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="NEWEST">Newest first</option>
                        <option value="OLDEST">Oldest first</option>
                        <option value="PRIORITY">Priority order</option>
                    </select>

                </div>

                <div className="table-scroll">

                    <table>
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Invitation</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Applied</th>
                                <th>Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {visible.map((application) => (
                                <tr key={application._id}>

                                    <td>
                                        <strong>
                                            {application.user?.name || "Unknown"}
                                        </strong>

                                        <small>
                                            {application.user?.email || "—"}
                                        </small>
                                    </td>

                                    <td>
                                        {application.invitation?.code || "—"}
                                    </td>

                                    <td>
                                        <span className="table-status">
                                            {application.applicationStatus}
                                        </span>
                                    </td>

                                    <td>
                                        {application.priority || "—"}
                                    </td>

                                    <td>
                                        {application.createdAt
                                            ? new Date(
                                                application.createdAt
                                            ).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="table-action"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/applications/${application._id}`
                                                )
                                            }
                                        >
                                            View Details
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

                {visible.length === 0 && (
                    <p className="data-empty">
                        No applications found.
                    </p>
                )}

            </section>
        </main>
    );
}