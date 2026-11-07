import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import "./MemberInvitationSettings.css";

const API = import.meta.env.VITE_API_URL;

export default function MemberInvitationSettings() {
    const [members, setMembers] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadMembers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API}/admin/applications?status=APPROVED`,
                { headers: getAuthHeaders() }
            );

            const approvedMembers = response.data.filter(
                (app) =>
                    app.applicationStatus === "APPROVED" &&
                    app.user?.accountStatus === "ACTIVE"
            );

            setMembers(approvedMembers);

            const initialSettings = {};

            approvedMembers.forEach((app) => {
                initialSettings[app.user._id] = {
                    canGenerateInvitations:
                        app.user.canGenerateInvitations || false,
                    invitationQuota:
                        app.user.invitationQuota || 0
                };
            });

            setSettings(initialSettings);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load approved members."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleChange = (userId, field, value) => {
        setSettings((prev) => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value
            }
        }));
    };

    const handleSave = async (userId) => {
        setSaving((prev) => ({
            ...prev,
            [userId]: true
        }));

        setMessage("");
        setError("");

        try {
            const response = await axios.put(
                `${API}/admin/member-invitation-settings/${userId}`,
                {
                    canGenerateInvitations:
                        settings[userId].canGenerateInvitations,
                    invitationQuota:
                        Number(settings[userId].invitationQuota)
                },
                {
                    headers: getAuthHeaders()
                }
            );

            setMessage(response.data.message);

            await loadMembers();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update member settings."
            );
        } finally {
            setSaving((prev) => ({
                ...prev,
                [userId]: false
            }));
        }
    };

    if (loading) {
        return (
            <section className="member-settings-panel">
                <p>Loading approved members...</p>
            </section>
        );
    }

    return (
        <section className="member-settings-panel">

            <div className="member-settings-heading">
                <div>
                    <h2>Member Invitation Settings</h2>
                    <p>
                        Manage invitation permissions and quotas
                        for approved members.
                    </p>
                </div>

               
            </div>

            {message && (
                <div className="settings-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="settings-error">
                    {error}
                </div>
            )}

            {members.length === 0 ? (
                <div className="settings-empty">
                    No approved members found.
                </div>
            ) : (
                <div className="member-settings-list">

                    {members.map((app) => {
                        const user = app.user;
                        const userSettings = settings[user._id];

                        if (!userSettings) return null;

                        return (
                            <article
                                className="member-setting-card"
                                key={user._id}
                            >

                                <div className="member-setting-info">
                                    <div className="member-setting-avatar">
                                        {user.name
                                            ?.slice(0, 1)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>
                                        <span className="active-member-label">
                                            ACTIVE MEMBER
                                        </span>
                                    </div>
                                </div>

                                <div className="member-setting-controls">

                                    <label className="permission-toggle">
                                        <input
                                            type="checkbox"
                                            checked={
                                                userSettings.canGenerateInvitations
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    user._id,
                                                    "canGenerateInvitations",
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <span>
                                            Allow invitation generation
                                        </span>
                                    </label>

                                    <label className="quota-field">
                                        Invitation Quota

                                        <input
                                            type="number"
                                            min="0"
                                            value={userSettings.invitationQuota}
                                            onChange={(e) =>
                                                handleChange(
                                                    user._id,
                                                    "invitationQuota",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        className="settings-save"
                                        disabled={saving[user._id]}
                                        onClick={() =>
                                            handleSave(user._id)
                                        }
                                    >
                                        {saving[user._id]
                                            ? "Saving..."
                                            : "Save Settings"}
                                    </button>

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

        </section>
    );
}