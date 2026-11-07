import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ admin = false }) {

    const links = admin
        ? [
            ["/admin", "Overview", "▦"],
            ["/admin/applications", "Applications", "▤"],
            ["/admin/access-requests", "Access Requests", "📩"],
            ["/admin/invitations", "Invitations", "✉"],
            ["/admin/member-settings", "Member Settings", "⚙"],
            ["/admin/notifications", "Notifications", "♧"],
            ["/admin/audit-logs", "Audit logs", "◷"]
        ]
        : [
            ["/dashboard", "My dashboard", "▦"],
            ["/notifications", "Notifications", "♧"]
        ];

    return (
        <aside className="sidebar">

            <p className="sidebar-label">
                {admin ? "ADMIN WORKSPACE" : "MEMBER SPACE"}
            </p>

            {links.map(([to, label, icon]) => (
                <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                        `side-link ${isActive ? "active" : ""}`
                    }
                >
                    <span>{icon}</span>
                    {label}
                </NavLink>
            ))}

            <div className="sidebar-bottom">
                <div className="help-card">
                    <strong>Need help?</strong>
                    <p>
                        Contact your membership administrator for support.
                    </p>
                </div>
            </div>

        </aside>
    );
}