export default function BookDescription({ description, listingType, exchangeFor }) {
    const isExchange = listingType === "for_sale_and_exchange" || listingType === "exchange";

    return (
        <div className="book-description-section">
            <h2 className="section-title">About this book</h2>
            <p className="description-paragraph">
                {description || "No description provided for this listing."}
            </p>

            {isExchange && exchangeFor && (
                <div className="exchange-box">
                    <div className="exchange-header">
                        <span className="exchange-icon">🔄</span>
                        <span className="exchange-title">EXCHANGE FOR</span>
                    </div>
                    <p className="exchange-text">{exchangeFor}</p>
                </div>
            )}
        </div>
    );
}
