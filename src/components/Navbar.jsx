import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, BookOpen, UserPen, LogOut, Globe } from 'lucide-react';
import FilterModal from './FilterModal';
import '../styles/css/navbar.css';
import logoImg from "../assets/logo.png";

const BACKEND_URL = "http://localhost:8080";

const resolveImageUrl = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "" || path === "null") return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
};

const Navbar = ({ onSearch, onFilterChange }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { t, i18n } = useTranslation();

    const [query, setQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const profileRef = useRef(null);

    const displayName = user?.full_name || user?.fullName || user?.name || "User";
    const rawAvatar = user?.profile_image || user?.profileImage;
    const resolvedAvatarUrl = resolveImageUrl(rawAvatar);

    useEffect(() => {
        setAvatarError(false);
    }, [rawAvatar]);

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

    const handleLogoutClick = async () => {
        setIsProfileOpen(false);
        await logout();
        navigate('/login');
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f97316&color=fff&size=128`;
    const avatarSrc = (!avatarError && resolvedAvatarUrl) ? resolvedAvatarUrl : fallbackAvatarUrl;

    return (
        <header className="navbar">
            <div className="nav-left" onClick={() => navigate("/home")}>
                <div className="logo-badge">
                    <img src={logoImg} alt="Waraq Logo" className="logo-img" />
                </div>
                <span className="logo-text">Waraq</span>
            </div>

            <div className="nav-center">
                <div className="search-wrapper">
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder={t("navbar.searchPlaceholder")}
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
                            type="button"
                            className="search-btn"
                            aria-label="Search"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </form>

                    <FilterModal
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        onFilterChange={onFilterChange}
                    />
                </div>
            </div>

            <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    type="button"
                    onClick={toggleLanguage}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: '#f8fafc', fontWeight: '500', fontSize: '14px',
                        padding: '6px 12px', borderRadius: '8px', transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                >
                    <Globe size={16} />
                    <span>{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
                </button>

                <button
                    type="button"
                    className="nav-link-btn"
                    onClick={handleBrowseClick}
                >
                    {t("navbar.browse")}
                </button>

                {isAuthenticated ? (
                    <div className="avatar-wrapper" ref={profileRef}>
                        <div
                            className="avatar-container"
                            onClick={() => setIsProfileOpen((prev) => !prev)}
                            title={displayName}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={avatarSrc}
                                alt={displayName}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                                onError={() => setAvatarError(true)}
                            />
                        </div>

                        {isProfileOpen && (
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <strong title={displayName}>{displayName}</strong>
                                    <span title={user?.email}>{user?.email}</span>
                                </div>

                                <div className="dropdown-divider"></div>

                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate("/profile");
                                    }}
                                >
                                    <User size={16} className="dropdown-icon" />
                                    <span>{t("navbar.myProfile")}</span>
                                </button>

                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate("/editprofile");
                                    }}
                                >
                                    <UserPen size={16} className="dropdown-icon" />
                                    <span>{t("navbar.editProfile")}</span>
                                </button>

                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate("/mylistings");
                                    }}
                                >
                                    <BookOpen size={16} className="dropdown-icon" />
                                    <span>{t("navbar.myListings")}</span>
                                </button>

                                <div className="dropdown-divider"></div>

                                <button
                                    type="button"
                                    className="dropdown-item logout-item"
                                    onClick={handleLogoutClick}
                                >
                                    <LogOut size={16} className="dropdown-icon" />
                                    <span>{t("navbar.logout")}</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        className="nav-link-btn"
                        onClick={() => navigate('/login')}
                    >
                        {t("navbar.login")}
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;