import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { BookOpen, UserPen, LogOut, ChevronRight, User, GraduationCap } from "lucide-react";
import "../styles/css/profile.css";

const API_BASE = "http://localhost:8080/api/v1";

export default function Profile() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [listings, setListings] = useState([]);

    const fetchData = useCallback(async () => {
        if (!user?.userId) return;
        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, listingsRes] = await Promise.all([
            fetch(`${API_BASE}/users/${user.userId}/profile`, { headers }),
            fetch(`${API_BASE}/users/${user.userId}/listings?status=active&limit=3`, { headers }),
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (listingsRes.ok) setListings(await listingsRes.json());
    }, [user, token]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData().catch((err) => console.error("Failed to load profile:", err));
    }, [fetchData]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const memberSince = profile?.memberSince
        ? new Date(profile.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "";

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
            <Navbar />

            <div className="profile-layout">
                <aside className="profile-sidebar">
                    <div className="profile-avatar-wrap">
                        {profile?.profileImage ? (
                            <img src={profile.profileImage} alt="avatar" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar placeholder">
                                <User size={40} />
                            </div>
                        )}
                    </div>
                    <h2>{profile?.fullName || "..."}</h2>
                    <p className="profile-phone">{profile?.phoneNumber}</p>
                    <p className="profile-member-since">Member since {memberSince}</p>

                    <div className="profile-nav">
                        <button onClick={() => navigate("/mylistings")}>
                            <div className="profile-nav-left">
                                <BookOpen size={18} className="profile-nav-icon" />
                                <span>My Listings</span>
                            </div>
                            <ChevronRight size={16} className="profile-nav-chevron" />
                        </button>

                        <button onClick={() => navigate("/editprofile")}>
                            <div className="profile-nav-left">
                                <UserPen size={18} className="profile-nav-icon" />
                                <span>Edit Profile</span>
                            </div>
                            <ChevronRight size={16} className="profile-nav-chevron" />
                        </button>

                        <button className="logout" onClick={handleLogout}>
                            <div className="profile-nav-left">
                                <LogOut size={18} className="profile-nav-icon" />
                                <span>Logout</span>
                            </div>
                        </button>
                    </div>
                </aside>

                <main className="profile-main">
                    <div className="profile-main-header">
                        <h2>My Listings</h2>
                        <span className="view-all-link" onClick={() => navigate("/mylistings")}>
                            View all
                        </span>
                    </div>

                    <div className="profile-listings-grid">
                        {listings.map((item) => (
                            <div className="mini-card" key={item.id} onClick={() => navigate(`/listing/${item.id}`)}>
                                <div className="mini-card-image-wrap">
                                    {item.isExchange && <span className="mini-badge swap">SWAP</span>}
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="mini-card-body">
                                    <h4>{item.title}</h4>
                                    <p>{item.author}</p>
                                    <div className="mini-card-footer">
                                        {item.isExchange ? (
                                            <span className="mini-price exchange">Exchange</span>
                                        ) : (
                                            <span className="mini-price">{Number(item.price).toFixed(0)} JD</span>
                                        )}
                                        <span className="mini-condition">{item.condition}</span>
                                    </div>
                                    {item.universityName && (
                                        <p className="mini-university">
                                            <GraduationCap size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                                            {item.universityName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}