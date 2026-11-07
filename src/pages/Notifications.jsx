import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./DataPages.css";
const API = import.meta.env.VITE_API_URL;

export default function Notifications() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const load = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const [response] = await Promise.all([
                axios.get(
                    `${API}/notifications`,
                    {
                        headers: getAuthHeaders()
                    }
                ),
                isRefresh
                    ? new Promise(resolve => setTimeout(resolve, 700))
                    : Promise.resolve()
            ]);

            setItems(response.data);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not load notifications"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        load(false);
    }, []);

    const markRead = async (id) => {
        setUpdatingId(id);

        try {
            await axios.put(
                `${API}/notifications/${id}/read`,
                {},
                {
                    headers: getAuthHeaders()
                }
            );

            // Update only the clicked notification
            setItems(previousItems =>
                previousItems.map(notification =>
                    notification._id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not update notification"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <main className="data-page">

            <div className="data-heading">
                <div>
                    <span className="eyebrow">YOUR UPDATES</span>

                    <h1>Notifications</h1>

                    <p>
                        Important updates about your membership application.
                    </p>
                </div>

                <button
                    className="data-button"
                    onClick={() => load(true)}
                    disabled={refreshing}
                >
                    {refreshing ? "Refreshing..." : "↻ Refresh"}
                </button>
            </div>

            {refreshing && (
                <p style={{
                    color: "#6b7280",
                    marginBottom: "15px"
                }}>
                    Updating notifications...
                </p>
            )}

            <section className="data-card">

                <div className="notice-list">

                    {items.length === 0 ? (
                        <p className="data-empty">
                            You're all caught up. No notifications yet.
                        </p>
                    ) : (
                        items.map(notification => (

                            <article
                                className={`notice-item ${
                                    notification.isRead ? "" : "new"
                                }`}
                                key={notification._id}
                            >

                                <span className="notice-symbol">
                                    ✦
                                </span>

                                <div className="notice-content">

                                    <strong>
                                        {notification.message}
                                    </strong>

                                    <small>
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString()}
                                    </small>

                                </div>

                                {notification.isRead ? (
                                    <span className="notice-read">
                                        Read
                                    </span>
                                ) : (
                                    <button
                                        className="table-action"
                                        onClick={() => markRead(notification._id)}
                                        disabled={updatingId === notification._id}
                                    >
                                        {updatingId === notification._id
                                            ? "Updating..."
                                            : "Mark as read"}
                                    </button>
                                )}

                            </article>

                        ))
                    )}

                </div>

            </section>

        </main>
    );
}