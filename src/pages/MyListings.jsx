import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AddBookModal from "../components/AddBookModal";
import {
    Plus,
    PenLine,
    CheckCircle2,
    Trash2,
    Eye,
    Heart,
    Clock,
    Loader2,
    BookOpen
} from "lucide-react";
import "../styles/css/mylistings.css";

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

function timeAgo(dateString) {
    if (!dateString) return "";
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `Posted ${mins <= 1 ? "just now" : mins + " minutes ago"}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Posted ${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Posted ${days} day${days > 1 ? "s" : ""} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `Posted ${weeks} week${weeks > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `Posted ${months} month${months > 1 ? "s" : ""} ago`;
}

export default function MyListings() {
    const navigate = useNavigate();
    const { token } = useAuth(); // We only need the token now, not the user object!

    const [activeTab, setActiveTab] = useState("active"); // "active" | "sold"
    const [listings, setListings] = useState([]);
    const [counts, setCounts] = useState({ active_count: 0, sold_count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [brokenImages, setBrokenImages] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const resolvedUserId = user?.user_id || user?.userId || user?.id;

    const authHeaders = useCallback(
        () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
        [token]
    );

    const fetchCounts = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/listings/my/counts`, {
                headers: authHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setCounts({
                    active_count: data.active_count ?? data.activeCount ?? 0,
                    sold_count: data.sold_count ?? data.soldCount ?? 0,
                });
            }
        } catch (err) {
            console.error("Failed to load counts:", err);
        }
    }, [token, authHeaders]);

    const fetchListings = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `${API_BASE}/listings/my?status=${activeTab}`,
                { headers: authHeaders() }
            );
            if (!res.ok) throw new Error("Failed to load your listings.");
            const data = await res.json();
            setListings(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, activeTab, authHeaders]);

    useEffect(() => {
        void fetchCounts();
    }, [fetchCounts]);

    useEffect(() => {
        void fetchListings();
    }, [fetchListings]);

    const handleBookAdded = () => {
        void fetchCounts();
        void fetchListings();
    };

    const handleMarkAsSold = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/listings/${id}/status`, {
                method: "PATCH",
                headers: authHeaders(),
                body: JSON.stringify({ status: "sold" }),
            });
            if (!res.ok) throw new Error("Failed to update listing.");
            setListings((prev) => prev.filter((l) => l.id !== id));
            void fetchCounts();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this listing permanently?")) return;
        try {
            const res = await fetch(`${API_BASE}/listings/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok) throw new Error("Failed to delete listing.");
            setListings((prev) => prev.filter((l) => l.id !== id));
            void fetchCounts();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-listing/${id}`);
    };

    return (
        <div className="listings-page-wrapper">
            <Navbar />

            <div className="listings-content-container">
                <div className="my-listings-header">
                    <div>
                        <h1>My Listings</h1>
                        <p>Manage your books — edit, mark as sold, or remove.</p>
                    </div>
                    <button className="post-new-btn" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} />
                        <span>Post New Book</span>
                    </button>
                </div>

                <div className="listings-tabs">
                    <button
                        className={activeTab === "active" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("active")}
                    >
                        Active ({counts.active_count})
                    </button>
                    <button
                        className={activeTab === "sold" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("sold")}
                    >
                        Sold ({counts.sold_count})
                    </button>
                </div>

            {loading && <p className="listings-status">Loading...</p>}
            {error && <p className="listings-status error">{error}</p>}

            {!loading && !error && listings.length === 0 && (
                <p className="listings-status">
                    {activeTab === "active"
                        ? "You don't have any active listings yet."
                        : "You haven't sold anything yet."}
                </p>
            )}

            <div className="listings-list">
                {listings.map((item) => (
                    <div className="listing-row" key={item.id}>
                        <img
                            className="listing-thumb"
                            src={item.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80"}
                            alt={item.title}
                        />

                        <div className="listing-main">
                            <div className="listing-title-row">
                                <h3>{item.title}</h3>
                                {item.isExchange && <span className="swap-chip">SWAP</span>}
                            </div>
                            <p className="listing-author">by {item.author}</p>
                            <div className="listing-tags">
                                {item.condition && <span className="tag">{item.condition}</span>}
                                {item.category && <span className="tag">{item.category}</span>}
                                {item.universityName && <span className="tag strong">{item.universityName}</span>}
                                {item.facultyName && <span className="tag strong">{item.facultyName}</span>}
                            </div>
                            <div className="listing-meta">
                                <span>👁 {item.viewsCount} views</span>
                                <span>❤ {item.savesCount} saves</span>
                                <span>🕒 {timeAgo(item.postedAt)}</span>
                            </div>
                        </div>

                        <div className="listing-price-col">
                            {item.isExchange ? (
                                <span className="price exchange">Exchange</span>
                            ) : (
                                <span className="price">{Number(item.price).toFixed(0)} JD</span>
                            )}
                            <span className={`status-pill ${item.status}`}>
                                {item.status === "active" ? "Active" : "Sold"}
                            </span>
                        </div>

                        <div className="listing-actions">
                            <button className="action-btn edit" onClick={() => handleEdit(item.id)}>
                                ✏️ Edit
                            </button>
                            {item.status === "active" && (
                                <button className="action-btn sold" onClick={() => handleMarkAsSold(item.id)}>
                                    ✅ Mark as Sold
                                </button>
                            )}
                            <button className="action-btn delete" onClick={() => handleDelete(item.id)}>
                                🗑️ Delete
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && listings.length > 0 && (
                    <div className="listings-list">
                        {listings.map((item) => {
                            const rawImg = item.image || item.imageUrl || item.image_url;
                            const resolvedImg = resolveImageUrl(rawImg);
                            const isBroken = brokenImages[item.id] || !resolvedImg;

                            return (
                                <div className="listing-row" key={item.id}>
                                    <div className="listing-thumb-wrap">
                                        {isBroken ? (
                                            <div className="listing-thumb-placeholder">
                                                <BookOpen size={24} />
                                            </div>
                                        ) : (
                                            <img
                                                className="listing-thumb"
                                                src={resolvedImg}
                                                alt={item.title}
                                                onError={() =>
                                                    setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="listing-main">
                                        <div className="listing-title-row">
                                            <h3>{item.title}</h3>
                                            {item.isExchange && <span className="swap-chip">SWAP</span>}
                                        </div>
                                        <p className="listing-author">by {item.author || "Unknown Author"}</p>
                                        <div className="listing-tags">
                                            {item.condition && <span className="tag">{item.condition}</span>}
                                            {item.category && <span className="tag">{item.category}</span>}
                                            {item.universityName && <span className="tag strong">{item.universityName}</span>}
                                            {item.facultyName && <span className="tag strong">{item.facultyName}</span>}
                                        </div>
                                        <div className="listing-meta">
                                            <span className="meta-item">
                                                <Eye size={14} /> {item.viewsCount ?? item.views ?? 0} views
                                            </span>
                                            <span className="meta-item">
                                                <Heart size={14} /> {item.savesCount ?? item.saves ?? 0} saves
                                            </span>
                                            <span className="meta-item">
                                                <Clock size={14} /> {timeAgo(item.postedAt || item.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="listing-price-col">
                                        {item.isExchange ? (
                                            <span className="price exchange">Exchange</span>
                                        ) : (
                                            <span className="price">{Number(item.price || 0).toFixed(0)} JD</span>
                                        )}
                                        <span className={`status-pill ${item.status || "active"}`}>
                                            {item.status === "sold" ? "Sold" : "Active"}
                                        </span>
                                    </div>

                                    <div className="listing-actions">
                                        <button className="action-btn edit" onClick={() => handleEdit(item.id)}>
                                            <PenLine size={14} />
                                            <span>Edit</span>
                                        </button>
                                        {(item.status === "active" || !item.status) && (
                                            <button className="action-btn sold" onClick={() => handleMarkAsSold(item.id)}>
                                                <CheckCircle2 size={14} />
                                                <span>Mark as Sold</span>
                                            </button>
                                        )}
                                        <button className="action-btn delete" onClick={() => handleDelete(item.id)}>
                                            <Trash2 size={14} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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
