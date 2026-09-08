import React from 'react';
import '../../styles/css/details.css';
import '../../styles/css/book-header.css';

export default function BookHeader({ title, author, price, condition, category, universityName }) {
    // Standardize labels
    const categoryLabel = category === "academic" ? "Academic" : "General";
    
    // Capitalize condition
    const conditionLabel = condition ? condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase() : "Good";

    // CSS class for condition styling
    const getConditionClass = (cond) => {
        const c = cond ? cond.toLowerCase() : '';
        if (c === 'excellent' || c === 'new') return 'badge-excellent';
        if (c === 'good') return 'badge-good';
        return 'badge-fair';
    };

    return (
        <div className="book-header-container book-header-section">
            {/* Badges / Pills */}
            <div className="book-header-badges badge-row">
                <span className={`badge condition-badge ${getConditionClass(condition)} badge-pill condition-${condition || "good"}`}>
                    {conditionLabel}
                </span>
                <span className={`badge category-badge ${category === 'academic' ? 'badge-academic' : 'badge-general'} badge-pill category-badge`}>
                    {categoryLabel}
                </span>
                {category === "academic" && universityName && (
                    <span className="badge badge-academic badge-pill university-badge">
                        {universityName}
                    </span>
                )}
            </div>

            {/* Title & Author */}
            <h1 className="book-header-title details-book-title">{title || "Untitled Book"}</h1>
            <p className="book-header-author details-book-author">by <span>{author || "Unknown Author"}</span></p>

            {/* Price & Stock status */}
            <div className="book-header-price-row">
                <div className="price-tag details-price-tag">
                    <span className="price-amount">
                        {price !== undefined && price !== null && Number(price) > 0 ? `${Number(price).toFixed(2)}` : "Free"}
                    </span>
                    {price !== undefined && price !== null && Number(price) > 0 && (
                        <span className="price-currency"> JD</span>
                    )}
                </div>
                <div className="stock-status">
                    <span className="status-dot"></span>
                    Available
                </div>
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
