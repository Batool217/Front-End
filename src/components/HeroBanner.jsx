import React from 'react';
import '../styles/css/hero.css';

export default function HeroBanner({ onAddBook }) {
    return (
        <div className="hero-banner">
            <div className="hero-content">
                <span className="hero-tagline">JORDAN'S STUDENT BOOK MARKETPLACE</span>
                <h1 className="hero-title">Buy, sell, and borrow books across universities</h1>
                <p className="hero-subtitle">Find textbooks from UJ, JUST, Yarmouk, Mutah and more.</p>
                <button className="add-book-btn" onClick={onAddBook}>
                    + Add Book
                </button>
            </div>
            <div className="hero-image">
                <div className="books-stack-graphic" aria-label="Stacked books illustration">📚</div>
            </div>
        </div>
    );
}