import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BookOpen, GraduationCap, Loader2 } from "lucide-react";
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

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [brokenImages, setBrokenImages] = useState({});
    const [avatarFailed, setAvatarFailed] = useState(false);

    const loadProfileData = useCallback(async () => {
        if (!id) return;
        setLoading(true);

        try {
            // Fetch profile data
            const profileRes = await fetch(`${API_BASE}/users/${id}/profile`);
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setProfile(profileData);
            }

            // Fetch public listings for this user
            const listingsRes = await fetch(`${API_BASE}/listings?limit=100`);
            if (listingsRes.ok) {
                const listingsData = await listingsRes.json();
                if (Array.isArray(listingsData)) {
                    // Manually filter by publisher_id in case the backend doesn't support the query param
                    const userListings = listingsData.filter(item => String(item.publisher_id) === String(id));
                    setListings(userListings);
                } else {
                    setListings([]);
                }
            }
        } catch (err) {
            console.error("Failed to load user profile data:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

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

    const displayName = profile?.full_name || profile?.fullName || profile?.name || "User";
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
                        <p className="profile-member-since">
                            {memberSince ? `Member since ${memberSince}` : "Member"}
                        </p>
                    </aside>

                    {/* Main Content Area */}
                    <main className="profile-main">
                        <div className="profile-main-header">
                            <h2>{displayName}'s Listings</h2>
                            <span className="view-all-link">
                                {listings.length} active listings
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
                                    const rawItemImg = item.image || item.imageUrl || item.image_url || (item.imagesUrl && item.imagesUrl[0]) || (item.images_url && item.images_url[0]);
                                    const resolvedImg = resolveImageUrl(rawItemImg);
                                    const defaultCover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80";
                                    const displayImage = (!brokenImages[item.id] && resolvedImg) ? resolvedImg : defaultCover;

                                    return (
                                        <div className="mini-card" key={item.id} onClick={() => navigate(`/listing/${item.id}`)}>
                                            <div className="mini-card-image-wrap">
                                                {item.isExchange && <span className="mini-badge swap">SWAP</span>}

                                                <img
                                                    src={displayImage}
                                                    alt={item.title}
                                                    onError={() =>
                                                        setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                                                    }
                                                />
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
                                <h3>No active listings</h3>
                                <p>This user hasn't listed any books yet.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}