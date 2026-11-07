import { useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import "./GenerateInvitation.css";

const API = import.meta.env.VITE_API_URL;

export default function GenerateInvitation() {
    const [usageLimit, setUsageLimit] = useState(1);
    const [expiresAt, setExpiresAt] = useState("");
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");
        setInvitation(null);
        setCopied(false);

        try {
            const payload = {
                usageLimit: Number(usageLimit)
            };

            if (expiresAt) {
                payload.expiresAt = new Date(expiresAt).toISOString();
            }

            const response = await axios.post(
                `${API}/member/generate-invitation`,
                payload,
                {
                    headers: getAuthHeaders()
                }
            );

            setInvitation(response.data.invitation);

            setMessage(
                response.data.message ||
                "Invitation generated successfully."
            );

            setUsageLimit(1);
            setExpiresAt("");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not generate invitation."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(invitation.code);

            setCopied(true);
            setError("");

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch {
            setError("Could not copy code. Please copy it manually.");
        }
    };

    return (
        <section className="panel invitation-panel">

            <div className="panel-heading">
                <div>
                    <h3>Generate Invitation</h3>
                    <p>
                        Invite others to apply for membership using your invitation code.
                    </p>
                </div>
            </div>

            <form onSubmit={handleGenerate}>

                <div className="detail-row">
                    <label htmlFor="usageLimit">
                        Usage Limit
                    </label>

                    <input
                        id="usageLimit"
                        type="number"
                        min="1"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        required
                    />
                </div>

                <div className="detail-row">
                    <label htmlFor="expiresAt">
                        Expiry Date (Optional)
                    </label>

                    <input
                        id="expiresAt"
                        type="datetime-local"
                        value={expiresAt}
                        min={
                            new Date(
                                Date.now() -
                                new Date().getTimezoneOffset() * 60000
                            ).toISOString().slice(0, 16)
                        }
                        onChange={(e) => setExpiresAt(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >
                    {loading
                        ? "Generating..."
                        : "Generate Invitation Code"}
                </button>

            </form>

            {message && (
                <div className="alert-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}

            {invitation && (
                <div className="generated-invitation">

                    <h4>Your Invitation Code</h4>

                    <div className="detail-row">

                        <strong>{invitation.code}</strong>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleCopy}
                        >
                            {copied ? "Copied ✓" : "Copy Code"}
                        </button>

                    </div>

                    <p>
                        Usage Limit: {invitation.usageLimit}
                    </p>

                    <p>
                        Expiry:{" "}
                        {invitation.expiresAt
                            ? new Date(invitation.expiresAt).toLocaleString()
                            : "No expiry"}
                    </p>

                    <p>
                        Share this code with people you want to invite.
                    </p>

                </div>
            )}

        </section>
    );
}