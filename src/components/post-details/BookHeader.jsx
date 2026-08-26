export default function BookHeader({ title, author, price, condition, category, universityName }) {
    // Standardize labels
    const categoryLabel = category === "academic" ? "Academic" : "General";
    
    // Capitalize condition
    const conditionLabel = condition ? condition.charAt(0).toUpperCase() + condition.slice(1) : "Good";

    return (
        <div className="book-header-section">
            {/* Badges / Pills */}
            <div className="badge-row">
                <span className={`badge-pill condition-${condition || "good"}`}>
                    {conditionLabel}
                </span>
                <span className="badge-pill category-badge">
                    {categoryLabel}
                </span>
                {category === "academic" && universityName && (
                    <span className="badge-pill university-badge">
                        {universityName}
                    </span>
                )}
            </div>

            {/* Title & Author */}
            <h1 className="details-book-title">{title || "Untitled Book"}</h1>
            <p className="details-book-author">by {author || "Unknown Author"}</p>

            {/* Price */}
            <div className="details-price-tag">
                {price !== undefined && price !== null ? `${Number(price).toFixed(2)} JD` : "Free"}
            </div>

            {/* Condition Banner if Excellent */}
            {condition?.toLowerCase() === "excellent" && (
                <div className="condition-excellence-banner">
                    Item Condition: Excellent - like new or similar
                </div>
            )}
        </div>
    );
}
