import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AddBookModal from "../components/AddBookModal";
import { BookOpen, UserPen, LogOut, ChevronRight, GraduationCap, PlusCircle, Loader2 } from "lucide-react";
import "../styles/css/profile.css";

const API_BASE = "http://localhost:8080/api/v1";
const BACKEND_URL = "http://localhost:8080";

const resolveImageUrl = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "" || path === "null") return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
};

export default function Profile() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [brokenImages, setBrokenImages] = useState({});
    const [avatarFailed, setAvatarFailed] = useState(false);

    const resolvedUserId = user?.user_id || user?.userId || user?.id;

    const loadProfileData = useCallback(async () => {
        if (!resolvedUserId) {
            setLoading(false);
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [profileRes, listingsRes] = await Promise.all([
                fetch(`${API_BASE}/users/${resolvedUserId}/profile`, { headers }),
                fetch(`${API_BASE}/users/${resolvedUserId}/listings?status=active&limit=3`, { headers }),
            ]);

            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setProfile(profileData);
            }

            if (listingsRes.ok) {
                const listingsData = await listingsRes.json();
                setListings(Array.isArray(listingsData) ? listingsData : []);
            }
        } catch (err) {
            console.error("Failed to load profile data:", err);
        } finally {
            setLoading(false);
        }
    }, [resolvedUserId, token]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            void loadProfileData();
        }

        return () => {
            isMounted = false;
        };
    }, [loadProfileData]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleBookAdded = () => {
        void loadProfileData();
    };

    const formatMemberSince = (data) => {
        const raw = data?.member_since || data?.memberSince || data?.created_at || data?.createdAt;
        if (!raw) return null;

        try {
            if (Array.isArray(raw)) {
                const [year, month, day] = raw;
                const d = new Date(year, month - 1, day);
                return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            }

            const d = new Date(raw);
            if (isNaN(d.getTime())) return null;

            return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        } catch {
            return null;
        }
    };

    const displayName = profile?.full_name || profile?.fullName || profile?.name || user?.name || "User";
    const phoneNumber = profile?.phone_number || profile?.phoneNumber || user?.phone_number || user?.phoneNumber;
    const memberSince = formatMemberSince(profile);

    const rawProfileImg = profile?.profile_image || profile?.profileImage;
    const profileImageUrl = resolveImageUrl(rawProfileImg);
    const defaultAvatarUrl = `https://ui-avatars.com/api/v1/?name=${encodeURIComponent(displayName)}&background=f97316&color=fff&size=128`;

    return (
        <div className="profile-page-wrapper">
            <Navbar />

            <div className="profile-content-container">
                <div className="profile-layout">
                    {/* Left Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-avatar-wrap">
                            <img
                                src={!avatarFailed && profileImageUrl ? profileImageUrl : defaultAvatarUrl}
                                alt={displayName}
                                className="profile-avatar"
                                onError={() => setAvatarFailed(true)}
                            />
                        </div>
                        <h2>{displayName}</h2>
                        {phoneNumber && <p className="profile-phone">{phoneNumber}</p>}
                        <p className="profile-member-since">
                            {memberSince ? `Member since ${memberSince}` : "Member"}
                        </p>

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

                    {/* Main Content Area */}
                    <main className="profile-main">
                        <div className="profile-main-header">
                            <h2>My Listings</h2>
                            <span className="view-all-link" onClick={() => navigate("/mylistings")}>
                                View all
                            </span>
                        </div>

                        {loading ? (
                            <div className="profile-loading-state">
                                <Loader2 size={28} className="spinner-icon" />
                                <p>Loading listings...</p>
                            </div>
                        ) : listings.length > 0 ? (
                            <div className="profile-listings-grid">
                                {listings.map((item) => {
                                    const rawItemImg = item.image || item.imageUrl || item.image_url;
                                    const resolvedImg = resolveImageUrl(rawItemImg);
                                    const isBroken = brokenImages[item.id] || !resolvedImg;

                                    return (
                                        <div className="mini-card" key={item.id} onClick={() => navigate(`/listing/${item.id}`)}>
                                            <div className="mini-card-image-wrap">
                                                {item.isExchange && <span className="mini-badge swap">SWAP</span>}

                                                {isBroken ? (
                                                    <div className="mini-card-placeholder">
                                                        <BookOpen size={36} className="placeholder-book-icon" />
                                                        <span className="placeholder-text">No Cover Available</span>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={resolvedImg}
                                                        alt={item.title}
                                                        onError={() =>
                                                            setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div className="mini-card-body">
                                                <h4>{item.title}</h4>
                                                <p>{item.author || "Unknown Author"}</p>
                                                <div className="mini-card-footer">
                                                    {item.isExchange ? (
                                                        <span className="mini-price exchange">Exchange</span>
                                                    ) : (
                                                        <span className="mini-price">{Number(item.price || 0).toFixed(0)} JD</span>
                                                    )}
                                                    <span className="mini-condition">{item.condition || "Used"}</span>
                                                </div>
                                                {item.universityName && (
                                                    <p className="mini-university">
                                                        <GraduationCap size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                                                        {item.universityName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-listings-box">
                                <BookOpen size={42} className="empty-icon" />
                                <h3>No active listings yet</h3>
                                <p>You haven't listed any books for sale or exchange.</p>
                                <button className="add-listing-btn" onClick={() => setIsAddModalOpen(true)}>
                                    <PlusCircle size={16} />
                                    <span>Post a Book</span>
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Add Book Modal */}
            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onBookAdded={handleBookAdded}
            />
        </div>
    );
}