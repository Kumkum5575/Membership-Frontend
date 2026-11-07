import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./DataPages.css";

const API = import.meta.env.VITE_API_URL;

export default function Invitations() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usageLimit, setUsageLimit] = useState(5);
    const [expiryDays, setExpiryDays] = useState(30);
    const [busy, setBusy] = useState(false);

    // Load all invitation codes
    const load = async () => {
        try {
            const response = await axios.get(
                `${API}/admin/invitations`,
                {
                    headers: getAuthHeaders()
                }
            );

            setItems(response.data);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not load invitations"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // Create new invitation
    const create = async (e) => {
        e.preventDefault();

        setBusy(true);

        try {
            await axios.post(
                `${API}/admin/create-invitation`,
                {
                    usageLimit: Number(usageLimit),
                    expiryDays: Number(expiryDays)
                },
                {
                    headers: getAuthHeaders()
                }
            );

            await load();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not create invitation"
            );
        } finally {
            setBusy(false);
        }
    };

    // Revoke invitation
    const revoke = async (id) => {
        if (!window.confirm("Revoke this invitation code?")) {
            return;
        }

        try {
            await axios.put(
                `${API}/admin/revoke-invitation/${id}`,
                {},
                {
                    headers: getAuthHeaders()
                }
            );

            await load();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not revoke invitation"
            );
        }
    };

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

                    <h1>Invitations</h1>

                    <p>
                        Create and manage invitation codes and usage limits.
                    </p>
                </div>
            </div>

            {/* Create Invitation */}
            <section className="data-card create-card">

                <h2>Create invitation</h2>

                <p>
                    Generate a new code with a usage limit and expiry period.
                </p>

                <form
                    className="invite-form"
                    onSubmit={create}
                >
                    <label>
                        Usage limit

                        <input
                            type="number"
                            min="1"
                            value={usageLimit}
                            onChange={(e) =>
                                setUsageLimit(e.target.value)
                            }
                            required
                        />
                    </label>

                    <label>
                        Expires in (days)

                        <input
                            type="number"
                            min="1"
                            value={expiryDays}
                            onChange={(e) =>
                                setExpiryDays(e.target.value)
                            }
                            required
                        />
                    </label>

                    <button
                        className="data-button"
                        type="submit"
                        disabled={busy}
                    >
                        {busy
                            ? "Creating..."
                            : "＋ Create code"}
                    </button>
                </form>
            </section>

            {/* All Invitation Codes */}
            <section className="data-card">

                <div className="data-card-title">
                    <h2>All invitation codes</h2>

                    <button
                        className="data-button secondary"
                        type="button"
                        onClick={load}
                    >
                        Refresh
                    </button>
                </div>

                <div className="table-scroll">

                    <table>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Usage</th>
                                <th>Expiry date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((i) => (
                                <tr key={i._id}>

                                    <td>
                                        <strong className="code-text">
                                            {i.code}
                                        </strong>
                                    </td>

                                    <td>
                                        {i.usedCount} / {i.usageLimit}
                                    </td>

                                    <td>
                                        {i.expiresAt
                                            ? new Date(
                                                i.expiresAt
                                            ).toLocaleDateString()
                                            : "No expiry"}
                                    </td>

                                    <td>
                                        <span
                                            className={`table-status ${
                                                i.status === "ACTIVE"
                                                    ? "active"
                                                    : "inactive"
                                            }`}
                                        >
                                            {i.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="table-action"
                                            type="button"
                                            disabled={i.status !== "ACTIVE"}
                                            onClick={() => revoke(i._id)}
                                        >
                                            Revoke
                                        </button>
                                    </td>

                                </tr>
                            ))}

                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="5">
                                        No invitation codes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </section>

        </main>
    );
}