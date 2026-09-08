import '../styles/css/hero.css';

export default function HeroBanner({ onAddBook }) {
    return (
        <div className="hero-banner">
            {/* Ambient Background Circles */}
            <div className="hero-bg-circle-center" aria-hidden="true" />
            <div className="hero-bg-circle-right" aria-hidden="true" />

            {/* Left Content */}
            <div className="hero-content">
                <span className="hero-tagline">JORDAN'S COMMUNITY BOOK MARKETPLACE</span>
                <h1 className="hero-title">
                    Buy, sell, and exchange<br />books across Jordan
                </h1>
                <p className="hero-subtitle">Discover thousands of books, novels, and educational resources from readers across the Kingdom</p>

                <button className="add-book-btn" onClick={onAddBook} type="button">
                    + Add Book
                </button>
            </div>

            {/* Right Illustration */}
            <div className="hero-graphic-wrapper">
                <svg
                    className="hero-books-svg"
                    width="150"
                    height="120"
                    viewBox="0 0 150 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 1. Orange Book */}
                    <rect x="10" y="15" width="24" height="90" rx="4" fill="#f97316" />
                    <rect x="10" y="15" width="6" height="90" rx="3" fill="#ea580c" />
                    <rect x="18" y="27" width="10" height="3" rx="1.5" fill="#ffffff" opacity="0.8" />

                    {/* 2. Dark Navy Book */}
                    <rect x="38" y="28" width="24" height="77" rx="4" fill="#1e293b" />
                    <rect x="38" y="28" width="6" height="77" rx="3" fill="#0f172a" />
                    <rect x="46" y="40" width="10" height="3" rx="1.5" fill="#ffffff" opacity="0.8" />

                    {/* 3. Sky Blue Book */}
                    <rect x="70" y="48" width="24" height="57" rx="4" fill="#0284c7" />
                    <rect x="70" y="48" width="6" height="57" rx="3" fill="#0369a1" />
                    <rect x="78" y="60" width="10" height="3" rx="1.5" fill="#ffffff" opacity="0.8" />

                    {/* Shelf / Base Line */}
                    <rect x="0" y="105" width="110" height="5" rx="2.5" fill="#f97316" opacity="0.9" />
                </svg>
            </div>
        </div>
    );
}