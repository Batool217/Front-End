import "../styles/css/card.css";

function BookCard({
                      id,
                      bookId,
                      title,
                      coverImage,
                      cover_image,
                      image,
                      imagesUrl,
                      images_url,
                      price,
                      listingType,
                      listing_type,
                      onClick,
                  }) {
    const defaultCover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80";
    const displayImage =
        coverImage || cover_image || image || imagesUrl?.[0] || images_url?.[0] || defaultCover;

    const isSwap =
        listingType === "for_sale_and_exchange" || listing_type === "for_sale_and_exchange";

    return (
        <div className="book-card" onClick={() => onClick && onClick(id || bookId)}>
            <div className="book-image-wrapper" style={{ position: "relative" }}>
                {/* Orange Swap Badge */}
                {isSwap && (
                    <span
                        style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "rgba(249, 115, 22, 0.95)",
                            backdropFilter: "blur(4px)",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            zIndex: 2,
                        }}
                    >
                        ⇄ Swap
                    </span>
                )}

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

                {/* Only renders price when a price exists */}
                {price !== undefined && price !== null && !isNaN(Number(price)) && (
                    <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "700", color: "#f97316" }}>
                        {Number(price).toFixed(2)} JOD
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookCard;