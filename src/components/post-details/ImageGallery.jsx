import { useState } from "react";

export default function ImageGallery({ mainImage, additionalImages = [] }) {
    const defaultCover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80";
    const displayImage = mainImage || defaultCover;
    
    // Combine mainImage and additionalImages, ensuring no duplicates
    const allImages = [
        displayImage,
        ...additionalImages.filter(img => img && img !== displayImage)
    ].slice(0, 4); // Limit to 4 images for display

    const [activeImage, setActiveImage] = useState(displayImage);

    // If the mainImage prop changes, update the active image
    useState(() => {
        setActiveImage(displayImage);
    }, [displayImage]);

    return (
        <div className="image-gallery-container">
            {/* Main Active Image Display */}
            <div className="main-image-wrapper">
                <img
                    src={activeImage}
                    alt="Book Cover"
                    className="main-display-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultCover;
                    }}
                />
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
                <div className="thumbnail-row">
                    {allImages.map((img, index) => (
                        <div
                            key={index}
                            className={`thumbnail-wrapper ${img === activeImage ? "active" : ""}`}
                            onClick={() => setActiveImage(img)}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className="thumbnail-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultCover;
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
