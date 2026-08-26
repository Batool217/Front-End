import React from 'react';
import '../../styles/css/book-header.css';

export default function BookHeader({ 
    title = "عنوان الكتاب الافتراضي", 
    author = "اسم الكاتب غير متوفر", 
    price = 0, 
    category = "General", 
    condition = "Good",
    isExchangeable = false
}) {
    // Determine CSS class based on the book condition
    const getConditionClass = (cond) => {
        const c = cond ? cond.toLowerCase() : '';
        if (c === 'excellent' || c === 'new') return 'badge-excellent';
        if (c === 'good') return 'badge-good';
        return 'badge-fair';
    };

    return (
        <div className="book-header-container">
            {/* Top Badges */}
            <div className="book-header-badges">
                <span className={`badge category-badge ${category && category.toLowerCase() === 'academic' ? 'badge-academic' : 'badge-general'}`}>
                    {category}
                </span>
                
                <span className={`badge condition-badge ${getConditionClass(condition)}`}>
                    {condition}
                </span>

                {isExchangeable && (
                    <span className="badge exchange-badge">
                        قابل للمبادلة
                    </span>
                )}
            </div>

            {/* Book Title & Author */}
            <h1 className="book-header-title">{title}</h1>
            <p className="book-header-author">بواسطة: <span>{author}</span></p>

            {/* Price & Availability */}
            <div className="book-header-price-row">
                <div className="price-tag">
                    <span className="price-amount">{price}</span>
                    <span className="price-currency">ر.س</span>
                </div>
                <div className="stock-status">
                    <span className="status-dot"></span>
                    متاح حالياً
                </div>
            </div>
        </div>
    );
}
