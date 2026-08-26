export default function SellerCard({ sellerName, sellerRating, sellerSales, sellerActiveStatus, onViewProfile }) {
    const displayName = sellerName || "Waraq Seller";
    const ratingValue = sellerRating || 4.8;
    const salesCount = sellerSales || 15;
    const activeLabel = sellerActiveStatus || "Active today";
    
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=818cf8&color=fff`;

    return (
        <div className="seller-card-container">
            <div className="seller-left">
                <img src={avatarUrl} alt={displayName} className="seller-avatar" />
                <div className="seller-details">
                    <span className="seller-name">{displayName}</span>
                    <span className="seller-subinfo">
                        ⭐ {ratingValue} · {salesCount} sales · {activeLabel}
                    </span>
                </div>
            </div>
            <button
                type="button"
                className="view-profile-btn"
                onClick={() => onViewProfile && onViewProfile()}
            >
                View Profile
            </button>
        </div>
    );
}
