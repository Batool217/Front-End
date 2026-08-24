import React, { useState } from 'react';
import '../styles/css/navbar.css';

const Navbar = ({ onToggleFilter, onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <header className="navbar">
            {/* 1. Logo Section */}
            <div className="nav-left">
                <span className="logo-icon" role="img" aria-label="Book">📙</span>
                <span className="logo-text">Waraq</span>
            </div>

            {/* 2. Search & Filter Section */}
            <div className="nav-center">
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search books, authors, subjects..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <button
                        type="button"
                        className="filter-btn"
                        onClick={onToggleFilter}
                        aria-label="Filter"
                    >
                        {/* Funnel Icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                    </button>

                    <button
                        type="submit"
                        className="search-btn"
                        aria-label="Search"
                    >
                        {/* Magnifying Glass Icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>
            </div>

            {/* 3. Browse & Profile Section */}
            <div className="nav-right">
                <a href="/browse" className="browse-link">Browse</a>
                <div className="avatar-container">
                    {/* يمكنك استبدال الرابط بصورة المستخدم الحقيقية لاحقاً */}
                    <img src="https://ui-avatars.com/api/?name=User&background=eaeaea&color=333" alt="User Profile" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;