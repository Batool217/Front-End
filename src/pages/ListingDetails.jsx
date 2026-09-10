import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PaperBackground from "../components/PaperBackground";
import ReportListingModal from "../components/ReportListingModal";
import { useAuth } from "../context/AuthContext";
import "../styles/css/listing-details.css";

export default function ListingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const [book, setBook] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/api/v1/listings/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch book details.");
                return res.json();
            })
            .then((data) => {
                setBook(data);
                if (data.publisher_id) {
                    return fetch(`http://localhost:8080/api/v1/users/${data.publisher_id}/profile`);
                }
                return null;
            })
            .then((res) => {
                if (res && res.ok) return res.json();
                return null;
            })
            .then((sellerData) => {
                if (sellerData) setSeller(sellerData);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load book details. It may have been removed.");
                setLoading(false);
            });
    }, [id]);

    const defaultCover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80";

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

    const displayImage = book.image || defaultCover;
    const isExchange = book.listing_type === "for_sale_and_exchange" || book.is_exchange;

    const timeAgo = (dateString) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "1 day ago";
        return `${diff} days ago`;
    };

    return (
        <div className="details-wrapper">
            <PaperBackground />
            <div style={{ position: "relative", zIndex: 100, margin: "0 0 28px 0" }}>
                <Navbar onSearch={() => navigate("/home")} onFilterChange={() => navigate("/home")} onLogout={handleLogout} />
            </div>

            <main style={{ position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingLeft: "12px" }}>
                    <Link to="/home" className="back-link">← Back to Listings</Link>
                </div>

                <div className="listing-details-container">
                    {/* Left Column - Images */}
                    <div className="listing-left">
                        <img src={displayImage} alt={book.title} className="listing-main-image" />
                        <div className="listing-thumbnails">
                            <img src={displayImage} alt="thumbnail" className="listing-thumbnail" />
                            <img src={displayImage} alt="thumbnail" className="listing-thumbnail" style={{ opacity: 0.7 }} />
                            <img src={displayImage} alt="thumbnail" className="listing-thumbnail" style={{ opacity: 0.7 }} />
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="listing-right">
                        <div className="listing-badges">
                            <span className="badge badge-blue">{book.condition ? book.condition.charAt(0).toUpperCase() + book.condition.slice(1) : "Good"}</span>
                            <span className="badge">{book.category === "academic" ? "Academic" : "General"}</span>
                            {book.university_name && (
                                <span className="badge">{book.university_name.split(' - ')[0]}</span>
                            )}
                        </div>

                        <h1 className="listing-title">{book.title}</h1>
                        <p className="listing-author">by {book.author || "Unknown"}</p>

                        {book.price !== null && book.price !== undefined && (
                            <div className="listing-price">{Number(book.price).toFixed(0)} JD</div>
                        )}

                        <div className="listing-info-grid">
                            <div className="info-column">
                                <span className="info-icon">🏛️</span>
                                <span className="info-label">Faculty</span>
                                <span className="info-value">{book.faculty_name?.split(' ')[0] || "General"}</span>
                            </div>
                            <div className="info-column">
                                <span className="info-icon">📖</span>
                                <span className="info-label">Edition</span>
                                <span className="info-value">Not specified</span>
                            </div>
                            <div className="info-column">
                                <span className="info-icon">📅</span>
                                <span className="info-label">Posted</span>
                                <span className="info-value">{timeAgo(book.posted_at)}</span>
                            </div>
                        </div>

                        {/* Seller Card */}
                        <div className="user-card">
                            <div className="user-info">
                                <div className="user-avatar">
                                    {seller?.profile_image && !seller.profile_image.includes("default-avatar") ? (
                                        <img src={seller.profile_image.startsWith('http') ? seller.profile_image : `http://localhost:8080${seller.profile_image}`} alt={seller.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        "👤"
                                    )}
                                </div>
                                <div>
                                    <h4 className="user-name">{seller?.full_name || `Seller #${book.publisher_id}`}</h4>
                                    <div className="user-stats">
                                        <span className="star-icon">⭐</span> {seller?.rating || "0.0"} · Active today
                                    </div>
                                </div>
                            </div>
                            <button className="view-profile-btn">View Profile</button>
                        </div>

                        <div className="listing-description-section">
                            <h3 className="section-title">About this book</h3>
                            <p className="listing-description">
                                {book.description ? book.description : "No description provided."}
                            </p>
                        </div>

                        {isExchange && (
                            <div className="exchange-box">
                                <div className="exchange-title">
                                    <span>🔄</span> EXCHANGE FOR
                                </div>
                                <p className="exchange-text">
                                    {book.exchange_for || "Open to any relevant exchange offers."}
                                </p>
                            </div>
                        )}

                        <div className="action-buttons">
                            <button className="btn-report" onClick={() => setIsReportModalOpen(true)}>
                                ⚠️ Report
                            </button>
                            <button
                                className="btn-contact"
                                onClick={() => {
                                    if (seller?.phone_number) {
                                        const cleanNumber = seller.phone_number.replace(/\D/g, '');
                                        const message = encodeURIComponent(`مرحباً، أنا مهتم بالكتاب الذي تعرضه على منصة ورق: "${book?.title}"`);
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
