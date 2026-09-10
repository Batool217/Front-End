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
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        // ننتظر حتى يتوفر التوكن
        if (!token) return;

        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // 1. جلب الإعلانات (لا تحتاج userId لأننا نستخدم /my)
            const listingsRes = await fetch(`${API_BASE}/listings/my?status=active&limit=3`, { headers });
            if (listingsRes.ok) {
                setListings(await listingsRes.json());
            } else {
                console.error("Failed to fetch listings:", listingsRes.status);
            }

            // 2. جلب الملف الشخصي (فقط إذا كان الـ userId أو id متوفراً)
            const actualUserId = user?.userId || user?.id;
            if (actualUserId) {
                const profileRes = await fetch(`${API_BASE}/users/${actualUserId}/profile`, { headers });
                if (profileRes.ok) {
                    setProfile(await profileRes.json());
                }
            } else {
                console.warn("User ID is missing from AuthContext:", user);
            }

        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            // نضمن دائماً إيقاف شاشة التحميل في النهاية
            setLoading(false);
        }
    }, [user, token]);


    useEffect(() => {
        fetchData();
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
                    {memberSince && <p className="profile-member-since">Member since {memberSince}</p>}

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
                        <span className="view-all-link" onClick={() => navigate("/mylistings")} style={{ cursor: "pointer", color: "#e67e22" }}>
                            View all
                        </span>
                    </div>

                    {loading ? (
                        <p style={{ color: "#6b7280" }}>Loading your listings...</p>
                    ) : listings.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f9fafb", borderRadius: "8px", marginTop: "20px" }}>
                            <p style={{ color: "#6b7280", marginBottom: "15px" }}>You haven't posted any books yet.</p>
                            <button
                                onClick={() => navigate("/")}
                                style={{ backgroundColor: "#e67e22", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                                + Post New Book
                            </button>
                        </div>
                    ) : (
                        <div className="profile-listings-grid">
                            {listings.map((item) => (
                                <div className="mini-card" key={item.id} onClick={() => navigate(`/listing/${item.id}`)} style={{ cursor: "pointer" }}>
                                    <div className="mini-card-image-wrap">
                                        {item.isExchange && <span className="mini-badge swap">SWAP</span>}
                                        <img src={item.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80"} alt={item.title} />
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
                    )}
                </main>
            </div>
        </div>
    );
}
