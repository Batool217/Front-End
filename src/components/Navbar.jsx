import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterModal from './FilterModal';
import '../styles/css/navbar.css';

const Navbar = ({ onSearch, onFilterChange, onLogout }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    const handleBrowseClick = () => {
        const listingsElement = document.querySelector('.recent-listings');
        if (listingsElement) {
            listingsElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="navbar">
            {/* 1. Logo Section */}
            <div className="nav-left" onClick={() => navigate('/home')}>
                <span className="logo-badge">📙</span>
                <span className="logo-text">Waraq</span>
            </div>

            {/* 2. Search & Filter Section */}
            <div className="nav-center">
                <div className="search-wrapper">
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
                            className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            aria-label="Filter"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                        </button>

                        <button
                            type="submit"
                            className="search-btn"
                            aria-label="Search"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </form>

                    {/* Filter Modal Anchored Under Filter Icon */}
                    <FilterModal
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        onFilterChange={onFilterChange}
                    />
                </div>
            </div>

            {/* 3. Navigation Links & Avatar Profile Dropdown */}
            <div className="nav-right">
                <button
                    type="button"
                    className="nav-link-btn"
                    onClick={handleBrowseClick}
                >
                    Browse
                </button>

                <div className="avatar-wrapper" ref={profileRef}>
                    <div
                        className="avatar-container"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        title="Account Menu"
                    >
                        <img src="https://ui-avatars.com/api/?name=User&background=f97316&color=fff" alt="User Profile" />
                    </div>

                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <strong>My Account</strong>
                            </div>
                            <button
                                type="button"
                                className="dropdown-logout-btn"
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    if (onLogout) onLogout();
                                }}
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;