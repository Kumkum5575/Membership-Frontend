import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
    const { user } = useAuth();

    const target = user
        ? user.role === "admin"
            ? "/admin"
            : "/dashboard"
        : "/register";

    return (
        <main className="home-page">

            {/* NAVBAR */}
            <nav className="home-navbar">
                <Link to="/" className="brand">
                    <span className="brand-icon">M</span>
                    MemberFlow
                </Link>

                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#process">How it works</a>

                    {user ? (
                        <Link to={target} className="nav-cta">
                            Workspace →
                        </Link>
                    ) : (
                        <Link to="/login" className="nav-cta">
                            Sign in →
                        </Link>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="hero">

                <div className="hero-copy">

                    <span className="eyebrow">
                        <span className="eyebrow-dot"></span>
                        INVITATION-LED MEMBERSHIP PLATFORM
                    </span>

                    <h1>
                        Build your community.
                        <br />
                        <span>Make every connection count.</span>
                    </h1>

                    <p className="hero-description">
                        A smarter way to manage memberships.
                        From exclusive invitations and applications
                        to transparent reviews and successful onboarding,
                        everything happens in one place.
                    </p>

                    <div className="hero-actions">
                        <Link
                            className="btn btn-primary"
                            to={target}
                        >
                            {user ? "Open Workspace" : "Get Started"}
                            <span>→</span>
                        </Link>

                        {!user && (
                            <Link
                                className="btn btn-secondary"
                                to="/login"
                            >
                                Already a member? Sign in
                            </Link>
                        )}
                    </div>

                    <div className="trust-row">
                        <span>✓ Secure invitations</span>
                        <span>✓ Transparent reviews</span>
                        <span>✓ Easy tracking</span>
                    </div>
                </div>

                {/* RIGHT SIDE VISUAL */}
                <div className="hero-visual">

                    <div className="visual-orb"></div>

                    <div className="preview-card">

                        <div className="preview-top">
                            <div>
                                <small>MEMBERSHIP OVERVIEW</small>
                                <h3>Your application journey</h3>
                            </div>
                            <span className="preview-menu">•••</span>
                        </div>

                        <div className="preview-status">
                            <div className="status-icon">✓</div>
                            <div>
                                <strong>Application in progress</strong>
                                <small>Your application is being reviewed</small>
                            </div>
                        </div>

                        <div className="progress-heading">
                            <span>Application progress</span>
                            <strong>75%</strong>
                        </div>

                        <div className="progress-track">
                            <span></span>
                        </div>

                        <div className="preview-steps">
                            <div className="step completed">
                                <span>✓</span>
                                <small>Invited</small>
                            </div>

                            <div className="step completed">
                                <span>✓</span>
                                <small>Applied</small>
                            </div>

                            <div className="step active">
                                <span>3</span>
                                <small>Review</small>
                            </div>

                            <div className="step">
                                <span>4</span>
                                <small>Approved</small>
                            </div>
                        </div>

                        <div className="preview-divider"></div>

                        <div className="preview-bottom">
                            <div className="team-avatar">MF</div>

                            <div>
                                <strong>Membership Team</strong>
                                <small>Every application matters.</small>
                            </div>

                            <span className="team-check">✓</span>
                        </div>
                    </div>

                    <div className="floating-note">
                        <span>✦</span>
                        <div>
                            <strong>Simple. Secure.</strong>
                            <small>Everything in one place.</small>
                        </div>
                    </div>

                </div>
            </section>

            {/* FEATURES */}
            <section className="features-section" id="features">

                <div className="section-heading">
                    <span>WHY MEMBERFLOW?</span>
                    <h2>Everything you need to manage memberships.</h2>
                    <p>
                        A streamlined platform designed to make
                        membership management easier and more transparent.
                    </p>
                </div>

                <div className="feature-grid">

                    <article className="feature-card">
                        <div className="feature-icon purple">✉</div>
                        <span className="feature-number">01</span>
                        <h3>Smart Invitations</h3>
                        <p>
                            Generate unique invitation codes,
                            manage usage limits and control access securely.
                        </p>
                    </article>

                    <article className="feature-card">
                        <div className="feature-icon orange">◷</div>
                        <span className="feature-number">02</span>
                        <h3>Application Tracking</h3>
                        <p>
                            Keep applications organized and follow
                            every stage of the membership journey.
                        </p>
                    </article>

                    <article className="feature-card">
                        <div className="feature-icon green">✓</div>
                        <span className="feature-number">03</span>
                        <h3>Transparent Reviews</h3>
                        <p>
                            Manage priorities, review applications
                            and make informed membership decisions.
                        </p>
                    </article>

                </div>
            </section>

            {/* PROCESS */}
            <section className="process-section" id="process">

                <div className="section-heading">
                    <span>HOW IT WORKS</span>
                    <h2>Your membership journey, simplified.</h2>
                </div>

                <div className="process-grid">

                    <div className="process-item">
                        <span>01</span>
                        <h3>Get Invited</h3>
                        <p>Receive a valid invitation code from a member.</p>
                    </div>

                    <div className="process-item">
                        <span>02</span>
                        <h3>Apply</h3>
                        <p>Register and submit your membership application.</p>
                    </div>

                    <div className="process-item">
                        <span>03</span>
                        <h3>Get Reviewed</h3>
                        <p>The admin team reviews your application.</p>
                    </div>

                    <div className="process-item">
                        <span>04</span>
                        <h3>Get Approved</h3>
                        <p>Access your membership after approval.</p>
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="bottom-cta">
                <div>
                    <span>YOUR COMMUNITY STARTS HERE</span>
                    <h2>Ready to be part of something better?</h2>
                    <p>
                        Start your membership journey with MemberFlow.
                    </p>
                </div>

                <Link to={target} className="btn cta-button">
                    {user ? "Open Workspace" : "Get Started"} →
                </Link>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <Link to="/" className="brand">
                    <span className="brand-icon">M</span>
                    MemberFlow
                </Link>

                <p>
                    © 2026 MemberFlow. A smarter membership experience.
                </p>

                <span>Built for better communities.</span>
            </footer>

        </main>
    );
}