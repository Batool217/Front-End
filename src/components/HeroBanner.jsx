import '../styles/css/hero.css';

export default function HeroBanner({ onAddBook }) {
    return (
        <div className="hero-banner">
            {/* Ambient Background Circles */}
            <div className="hero-bg-circle-center" aria-hidden="true" />
            <div className="hero-bg-circle-right" aria-hidden="true" />

            {/* Left Content */}
            <div className="hero-content">
                <span className="hero-tagline">JORDAN'S STUDENT BOOK MARKETPLACE</span>
                <h1 className="hero-title">
                    Buy, sell, and borrow<br />books across universities
                </h1>
                <p className="hero-subtitle">Find textbooks from UJ, JUST, Yarmouk, Mutah and more.</p>

                <button className="add-book-btn" onClick={onAddBook} type="button">
                    + Add Book
                </button>
            </div>

            {/* Right Illustration */}
            <div className="hero-graphic-wrapper">
                <svg
                    className="hero-books-svg"
                    width="140"
                    height="120"
                    viewBox="0 0 140 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Green Book */}
                    <rect x="15" y="20" width="26" height="85" rx="4" fill="#84cc16" />
                    <rect x="15" y="20" width="6" height="85" rx="3" fill="#65a30d" />
                    <rect x="23" y="32" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.7" />

                    {/* Pink/Red Book */}
                    <rect x="47" y="32" width="26" height="73" rx="4" fill="#f43f5e" />
                    <rect x="47" y="32" width="6" height="73" rx="3" fill="#e11d48" />
                    <rect x="55" y="44" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.7" />

                    {/* Light Blue Book */}
                    <rect x="79" y="48" width="26" height="57" rx="4" fill="#38bdf8" />
                    <rect x="79" y="48" width="6" height="57" rx="3" fill="#0284c7" />
                    <rect x="87" y="60" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.7" />

                    {/* Bottom Base Line */}
                    <rect x="5" y="105" width="115" height="5" rx="2.5" fill="#ffffff" opacity="0.4" />
                </svg>
            </div>
        </div>
    );
}