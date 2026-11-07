import {
BrowserRouter,
Routes,
Route,
Navigate,
Outlet,
useNavigate,
useLocation
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import ApplicantDetails from "./pages/ApplicantDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Applications from "./pages/Applications";
import Invitations from "./pages/Invitations";
import Notifications from "./pages/Notifications";
import AuditLogs from "./pages/AuditLogs";
import AccessRequests from "./pages/AccessRequests";
import MemberInvitationSettings from "./components/MemberInvitationSettings";

import "./index.css";

// PROFESSIONAL BACK AND HOME NAVIGATION

function BackButton() {
const navigate = useNavigate();
const location = useLocation();


const goBack = () => {
    if (location.key !== "default") {
        navigate(-1);
    } else {
        navigate("/", { replace: true });
    }
};

return (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 24px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: "18px"
        }}
    >
        {location.pathname !== "/" && (
            <button
                onClick={goBack}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 12px",
                    backgroundColor: "transparent",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                }}
            >
                ← Back
            </button>
        )}

        <button
            onClick={() => navigate("/")}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 12px",
                backgroundColor: "transparent",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
            }}
        >
            🏠 Home
        </button>
    </div>
);


}

// WORKSPACE LAYOUT

function WorkspaceLayout({ admin = false }) {
return (
<> <Navbar />


        <BackButton />

        <div className="workspace-layout">
            <Sidebar admin={admin} />

            <div className="workspace-content">
                <Outlet />
            </div>
        </div>
    </>
);


}

// APP ROUTES

function AppRoutes() {
const { user } = useAuth();

return (
    <Routes>

        {/* HOME ROUTE */}

        <Route
            path="/"
            element={
                <>
                    <Navbar />
                    <Home />
                </>
            }
        />


        {/* LOGIN AND REGISTER ROUTES */}

        <Route
            element={
                <>
                    <Navbar />
                    <BackButton />
                    <Outlet />
                </>
            }
        >
            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate
                            to={
                                user.role === "admin"
                                    ? "/admin"
                                    : "/dashboard"
                            }
                            replace
                        />
                    ) : (
                        <Login />
                    )
                }
            />

            <Route
                path="/register"
                element={
                    user ? (
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    ) : (
                        <Register />
                    )
                }
            />
        </Route>


        {/* MEMBER ROUTES */}

        <Route element={<ProtectedRoute role="member" />}>
            <Route element={<WorkspaceLayout />}>
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />
            </Route>
        </Route>


        {/* ADMIN ROUTES */}

        <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<WorkspaceLayout admin />}>
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/applications"
                    element={<Applications />}
                />

                <Route
                    path="/admin/access-requests"
                    element={<AccessRequests />}
                />

                <Route
                    path="/admin/invitations"
                    element={<Invitations />}
                />

                <Route
                    path="/admin/applications/:id"
                    element={<ApplicantDetails />}
                />

                <Route
                    path="/admin/member-settings"
                    element={<MemberInvitationSettings />}
                />

                <Route
                    path="/admin/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/admin/audit-logs"
                    element={<AuditLogs />}
                />
            </Route>
        </Route>


        {/* FALLBACK ROUTE */}

        <Route
            path="*"
            element={<Navigate to="/" replace />}
        />

    </Routes>
);


}



export default function App() {
return ( <AuthProvider> <BrowserRouter> <AppRoutes /> </BrowserRouter> </AuthProvider>
);
}
