export default function ActionButtons({ onContactSeller, onReport }) {
    return (
        <div className="action-buttons-container">
            <button
                type="button"
                className="report-listing-btn"
                onClick={() => onReport && onReport()}
            >
                <span className="btn-icon">⚠️</span> Report
            </button>
            
            <button
                type="button"
                className="contact-seller-btn"
                onClick={() => onContactSeller && onContactSeller()}
            >
                <span className="btn-icon">💬</span> Contact Seller
            </button>
        </div>
    );
}
