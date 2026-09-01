import "../styles/css/card.css";

function BookCard({ id, title, coverImage, cover_image, image, imagesUrl, images_url, price, type, category, onClick }) {
    const defaultCover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80";
    const displayImage = coverImage || cover_image || image || imagesUrl?.[0] || images_url?.[0] || defaultCover;
    const tag = type || (category === "academic" ? "Academic" : null);

    return (
        <div className="book-card" onClick={() => onClick && onClick(id)}>
            <div className="book-image-wrapper">
                {tag && <span className="book-tag">{tag}</span>}
                <img
                    src={displayImage}
                    alt={title}
                    className="book-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultCover;
                    }}
                />
            </div>

            <div className="book-info">
                <h3 className="book-title">{title}</h3>
                {price !== undefined && price !== null && (
                    <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "700", color: "#f97316" }}>
                        {Number(price).toFixed(2)} JOD
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookCard;