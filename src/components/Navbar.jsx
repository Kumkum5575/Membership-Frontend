import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="topbar">
            <Link className="brand" to="/">
                <span className="brand-mark">M</span>
                <span>
                    Member<span className="brand-light">Flow</span>
                </span>
            </Link>

            <nav className="topnav">
                {user ? (
                    <>
                        <span className="nav-user">{user.name}</span>

                        <button
                            className="btn btn-outline btn-small"
                            onClick={handleLogout}
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            className="btn btn-outline btn-small"
                            to="/login"
                        >
                            Sign in
                        </Link>

                        <Link
                            className="btn btn-primary btn-small"
                            to="/register"
                        >
                            Get started
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}