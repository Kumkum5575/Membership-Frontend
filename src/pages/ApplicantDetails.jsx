import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./DataPages.css";

const API = import.meta.env.VITE_API_URL;

export default function ApplicantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);


    const [notes, setNotes] = useState("");

    
    const [savedAdminNotes, setSavedAdminNotes] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const response = await axios.get(
                    `${API}/admin/applications`,
                    {
                        headers: getAuthHeaders()
                    }
                );

                const found = response.data.find(
                    (item) => item._id === id
                );

                if (!found) {
                    alert("Application not found");
                    navigate("/admin/applications");
                    return;
                }

                setApplication(found);

                
                setSavedAdminNotes(found.adminNotes || "");

                
                setNotes("");

            } catch (error) {
                alert(
                    error.response?.data?.message ||
                    "Could not load applicant details"
                );

                navigate("/admin/applications");

            } finally {
                setLoading(false);
            }
        };

        loadDetails();

    }, [id, navigate]);

   
    const saveNotes = async () => {
        try {
            setSaving(true);

            const response = await axios.put(
                `${API}/admin/notes/${id}`,
                {
                    adminNotes: notes
                },
                {
                    headers: getAuthHeaders()
                }
            );

            const savedNotes =
                response.data.application.adminNotes || "";

            
            setSavedAdminNotes(savedNotes);

            
            setNotes("");

           
            setApplication((previous) => ({
                ...previous,

                adminNotes: savedNotes,

                reviewHistory: [
                    ...(previous.reviewHistory || []),
                    {
                        action: "ADMIN_NOTES_UPDATED",
                        note: savedNotes,
                        createdAt: new Date().toISOString()
                    }
                ]
            }));

            alert("Admin notes saved successfully!");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not save admin notes"
            );

        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    if (!application) return null;

    const user = application.user || {};
    const invitation = application.invitation || {};

    const showValue = (value) => value || "Not provided";

    return (
        <main className="data-page">

            <div className="data-heading">

                <div>
                    <span className="eyebrow">
                        ADMIN WORKSPACE
                    </span>

                    <h1>Applicant Details</h1>

                    <p>
                        Complete membership application information.
                    </p>
                </div>

                <button
                    className="data-button"
                    onClick={() => navigate("/admin/applications")}
                >
                    ← Back to Applications
                </button>

            </div>

            <section
                className="data-card"
                style={{ padding: "25px" }}
            >

               

                <h2>Personal Information</h2>

                <div className="detail-row">
                    <strong>Name</strong>
                    <span>{showValue(user.name)}</span>
                </div>

                <div className="detail-row">
                    <strong>Email</strong>
                    <span>{showValue(user.email)}</span>
                </div>

                <div className="detail-row">
                    <strong>Phone</strong>
                    <span>{showValue(user.phone)}</span>
                </div>

                <div className="detail-row">
                    <strong>Designation</strong>
                    <span>{showValue(user.designation)}</span>
                </div>

                <div className="detail-row">
                    <strong>Company</strong>
                    <span>{showValue(user.company)}</span>
                </div>

                <div className="detail-row">
                    <strong>Experience</strong>
                    <span>{showValue(user.experience)}</span>
                </div>


                

                <h2 style={{ marginTop: "30px" }}>
                    Application Information
                </h2>

                <div className="detail-row">
                    <strong>Account Status</strong>
                    <span>{showValue(user.accountStatus)}</span>
                </div>

                <div className="detail-row">
                    <strong>Invitation Code</strong>
                    <span>{showValue(invitation.code)}</span>
                </div>

                <div className="detail-row">
                    <strong>Invited By</strong>
                    <span>
                        {showValue(invitation.createdBy?.name)}
                    </span>
                </div>

                <div className="detail-row">
                    <strong>Registration Date</strong>

                    <span>
                        {application.createdAt
                            ? new Date(
                                application.createdAt
                            ).toLocaleString()
                            : "—"}
                    </span>
                </div>

                <div className="detail-row">
                    <strong>Priority</strong>
                    <span>{showValue(application.priority)}</span>
                </div>

                <div className="detail-row">
                    <strong>Application Status</strong>
                    <span>
                        {showValue(application.applicationStatus)}
                    </span>
                </div>


                

                <h2 style={{ marginTop: "30px" }}>
                    Add Admin Notes
                </h2>

                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write internal notes about this applicant..."
                    rows={5}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        resize: "vertical",
                        fontSize: "15px"
                    }}
                />

                <button
                    className="data-button"
                    onClick={saveNotes}
                    disabled={saving}
                    style={{ marginTop: "12px" }}
                >
                    {saving ? "Saving..." : "Save Notes"}
                </button>


                

                <h2 style={{ marginTop: "30px" }}>
                    Saved Admin Notes
                </h2>

                {savedAdminNotes ? (
                    <div
                        className="detail-row"
                        style={{
                            padding: "15px",
                            marginTop: "12px",
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        {savedAdminNotes}
                    </div>
                ) : (
                    <p className="data-empty">
                        No admin notes added yet.
                    </p>
                )}


            

                <h2 style={{ marginTop: "30px" }}>
                    Review History
                </h2>

                {application.reviewHistory?.length > 0 ? (

                    application.reviewHistory.map(
                        (history, index) => (

                            <div
                                key={history._id || index}
                                className="detail-row"
                            >

                                <div>
                                    <strong>
                                        {history.action}
                                    </strong>

                                    <p>
                                        {history.note ||
                                            "No additional notes"}
                                    </p>

                                    <small>
                                        {history.createdAt
                                            ? new Date(
                                                history.createdAt
                                            ).toLocaleString()
                                            : ""}
                                    </small>
                                </div>

                            </div>
                        )
                    )

                ) : (

                    <p className="data-empty">
                        No review history available.
                    </p>

                )}

            </section>

        </main>
    );
}