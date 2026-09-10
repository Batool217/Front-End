import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PaperBackground from "../components/PaperBackground";
import ReportListingModal from "../components/ReportListingModal";
import { useAuth } from "../context/AuthContext";
import {
    Calendar,
    GraduationCap,
    BookMarked,
    Star,
    RefreshCw,
    AlertTriangle,
    User as UserIcon,
    ChevronLeft
} from "lucide-react";
import "../styles/css/listing-details.css";

const API_BASE = "http://localhost:8080/api/v1";
const BACKEND_URL = "http://localhost:8080";
const DEFAULT_COVER = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80";

const resolveImageUrl = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "" || path === "null") return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
};

export default function ListingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [book, setBook] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    useEffect(() => {
        let isMounted = true;

        fetch(`${API_BASE}/listings/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch book details.");
                return res.json();
            })
            .then((data) => {
                if (!isMounted) return null;
                setBook(data);
                const pubId = data.publisher_id || data.publisherId;
                if (pubId) {
                    return fetch(`${API_BASE}/users/${pubId}/profile`);
                }
                return null;
            })
            .then((res) => {
                if (res && res.ok) return res.json();
                return null;
            })
            .then((sellerData) => {
                if (!isMounted) return;
                if (sellerData) setSeller(sellerData);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error(err);
                setError("Unable to load book details. It may have been removed.");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    const allImages = useMemo(() => {
        if (!book) return [DEFAULT_COVER];
        const arr = Array.isArray(book.images_url || book.imagesUrl)
            ? (book.images_url || book.imagesUrl)
            : [];
        const fallback = book.coverImage || book.cover_image || book.image;
        if (arr.length > 0) {
            const resolved = arr.map(resolveImageUrl).filter(Boolean);
            return resolved.length > 0 ? resolved : [DEFAULT_COVER];
        }
        if (fallback) {
            const single = resolveImageUrl(fallback);
            return single ? [single] : [DEFAULT_COVER];
        }
        return [DEFAULT_COVER];
    }, [book]);

    if (loading) {
        return (
            <div className="details-wrapper">
                <PaperBackground />
                <div style={{ position: "relative", zIndex: 100, margin: "0 0 28px 0" }}>
                    <Navbar onSearch={() => navigate("/home")} onFilterChange={() => navigate("/home")} onLogout={handleLogout} />
                </div>
                <div className="loading-container">Loading details...</div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="details-wrapper">
                <PaperBackground />
                <div style={{ position: "relative", zIndex: 100, margin: "0 0 28px 0" }}>
                    <Navbar onSearch={() => navigate("/home")} onFilterChange={() => navigate("/home")} onLogout={handleLogout} />
                </div>
                <div className="error-container">
                    <p>{error || "Book not found."}</p>
                    <button className="btn-report" onClick={() => navigate("/home")}>Back to Home</button>
                </div>
            </div>
        );
    }

    const currentImage = allImages[selectedImageIndex] || allImages[0] || DEFAULT_COVER;
    const isExchange = book.listing_type === "for_sale_and_exchange" || book.is_exchange;
    const isAcademic = book.category === "academic";

    const timeAgo = (dateString) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 0) return "Today";
        if (diff === 1) return "1 day ago";
        return `${diff} days ago`;
    };

    const handleImageError = (e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = DEFAULT_COVER;
    };

    const sellerAvatar = resolveImageUrl(seller?.profile_image || seller?.profileImage);

    const formatType = (type) => {
        if (!type) return "Book";
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ");
    };

    return (
        <div className="details-wrapper">
            <PaperBackground />
            <div style={{ position: "relative", zIndex: 100, margin: "0 0 28px 0" }}>
                <Navbar onSearch={() => navigate("/home")} onFilterChange={() => navigate("/home")} onLogout={handleLogout} />
            </div>

            <main style={{ position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", marginBottom: "16px" }}>
                    <Link to="/home" className="back-link">
                        <ChevronLeft size={20} />
                        <span className="back-link-text">Back to Listings</span>
                    </Link>
                </div>

                <div className="listing-details-container">
                    {/* Left Column - Gallery */}
                    <div className="listing-left">
                        <img
                            src={currentImage}
                            alt={book.title || "Book Cover"}
                            className="listing-main-image"
                            onError={handleImageError}
                        />
                        {allImages.length > 1 && (
                            <div className="listing-thumbnails">
                                {allImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`thumbnail-${idx}`}
                                        className={`listing-thumbnail ${selectedImageIndex === idx ? "active-thumbnail" : ""}`}
                                        style={{
                                            cursor: "pointer",
                                            opacity: selectedImageIndex === idx ? 1 : 0.6,
                                            border: selectedImageIndex === idx ? "2px solid #f97316" : "1px solid #e2e8f0"
                                        }}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        onError={handleImageError}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="listing-right">
                        <div className="listing-badges">
                            <span className="badge badge-blue">
                                {book.condition ? book.condition.charAt(0).toUpperCase() + book.condition.slice(1) : "Good"}
                            </span>
                            <span className="badge">
                                {isAcademic ? "Academic" : "General"}
                            </span>
                            {isAcademic && book.university_name && (
                                <span className="badge badge-academic">
                                    {book.university_name.split(' - ')[0]}
                                </span>
                            )}
                        </div>

                        <h1 className="listing-title">{book.title}</h1>
                        <p className="listing-author">by {book.author || "Unknown"}</p>

                        {book.price !== null && book.price !== undefined && (
                            <div className="listing-price">{Number(book.price).toFixed(0)} JD</div>
                        )}

                        {/* Quick Spec Row */}
                        <div className="listing-info-grid">
                            <div className="info-column">
                                <span className="info-icon"><BookMarked size={18} color="#f97316" /></span>
                                <span className="info-label">Type</span>
                                <span className="info-value">{formatType(book.sub_type || book.subType || "book")}</span>
                            </div>
                            <div className="info-column">
                                <span className="info-icon"><Calendar size={18} color="#f97316" /></span>
                                <span className="info-label">Posted</span>
                                <span className="info-value">{timeAgo(book.posted_at || book.created_at)}</span>
                            </div>
                        </div>

                        {/* College / Academic Details Box */}
                        {isAcademic && (
                            <div style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: 12,
                                padding: "14px 18px",
                                margin: "16px 0",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#12345b", fontWeight: 700, fontSize: 13.5 }}>
                                    <GraduationCap size={18} color="#12345b" />
                                    <span>College Information</span>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                                    {book.university_name && (
                                        <div>
                                            <span style={{ fontSize: 11.5, color: "#64748b", display: "block" }}>University</span>
                                            <strong style={{ fontSize: 13.5, color: "#1e293b" }}>{book.university_name}</strong>
                                        </div>
                                    )}
                                    {book.faculty_name && (
                                        <div>
                                            <span style={{ fontSize: 11.5, color: "#64748b", display: "block" }}>Faculty / College</span>
                                            <strong style={{ fontSize: 13.5, color: "#1e293b" }}>{book.faculty_name}</strong>
                                        </div>
                                    )}
                                    {book.major_name && (
                                        <div>
                                            <span style={{ fontSize: 11.5, color: "#64748b", display: "block" }}>Major</span>
                                            <strong style={{ fontSize: 13.5, color: "#1e293b" }}>{book.major_name}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Seller Card */}
                        <div className="user-card">
                            <div className="user-info">
                                <div className="user-avatar" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {sellerAvatar ? (
                                        <img
                                            src={sellerAvatar}
                                            alt={seller?.full_name || "Seller"}
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <UserIcon size={22} color="#f97316" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="user-name">{seller?.full_name || `Seller #${book.publisher_id}`}</h4>
                                    <div className="user-stats" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <Star size={13} fill="#eab308" stroke="#eab308" />
                                        <span>{seller?.rating || "5.0"} · Active today</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="view-profile-btn"
                                onClick={() => navigate(`/user/${book.publisher_id}`)}
                            >
                                View Profile
                            </button>
                        </div>

                        {/* Description */}
                        <div className="listing-description-section">
                            <h3 className="section-title">About this book</h3>
                            <p className="listing-description">
                                {book.description ? book.description : "No description provided."}
                            </p>
                        </div>

                        {/* Exchange Box */}
                        {isExchange && (
                            <div className="exchange-box">
                                <div className="exchange-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <RefreshCw size={15} />
                                    <span>EXCHANGE FOR</span>
                                </div>
                                <p className="exchange-text">
                                    {book.exchange_for || "Open to any relevant exchange offers."}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button
                                className="btn-report"
                                onClick={() => setIsReportModalOpen(true)}
                                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                            >
                                <AlertTriangle size={16} /> Report
                            </button>
                            <button
                                className="btn-contact"
                                onClick={() => {
                                    if (seller?.phone_number) {
                                        const cleanNumber = seller.phone_number.replace(/\D/g, '');
                                        const message = encodeURIComponent(`مرحباً، أنا مهتم بالكتاب المعروض على منصة ورق: "${book?.title}"`);
                                        window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
                                    } else {
                                        alert("Seller phone number is not available.");
                                    }
                                }}
                            >
                                Contact Seller
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <ReportListingModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                book={book}
            />
        </div>
    );
}