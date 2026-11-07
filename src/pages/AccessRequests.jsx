
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, getAuthHeaders } from "../context/AuthContext";
import "./AccessRequests.css";

export default function AccessRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRequests = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/access-requests`,
                { headers: getAuthHeaders() }
            );
            setRequests(response.data.requests);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to fetch requests");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(
                `${API_URL}/access-requests/${id}`,
                { status },
                { headers: getAuthHeaders() }
            );
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Status update failed");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="access-page">
            <div className="access-header">
                <div>
                    <h1>Access Requests</h1>
                    <p>Manage requests from users who don't have an invitation code.</p>
                </div>
                <div className="access-total">
                    <span>Total Requests</span>
                    <h2>{requests.length}</h2>
                </div>
            </div>

            {error && <p className="access-error">{error}</p>}

            <div className="access-card">
                <div className="access-card-header">
                    <h2>All Requests</h2>
                    <span>{requests.length} requests</span>
                </div>

                {loading ? (
                    <p className="access-message">Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="access-message">No access requests found.</p>
                ) : (
                    <div className="access-table-wrapper">
                        <table className="access-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Request Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request._id}>
                                        <td>{request.name}</td>
                                        <td>{request.email}</td>
                                        <td>
                                            <span className={`access-badge ${request.status.toLowerCase()}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <select
                                                className="access-select"
                                                value={request.status}
                                                onChange={(e) =>
                                                    updateStatus(request._id, e.target.value)
                                                }
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="REVIEWED">Reviewed</option>
                                                <option value="CLOSED">Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
