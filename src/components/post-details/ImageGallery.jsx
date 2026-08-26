import { useState, useEffect } from "react";

export default function ImageGallery({ mainImage, additionalImages = [], images = [] }) {
    const defaultCover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80";
    const displayImage = mainImage || defaultCover;
    
    // دمج الصورة الرئيسية مع الصور الإضافية وتجنب التكرار
    const allImages = images && images.length > 0 
        ? images 
        : [
            displayImage,
            ...additionalImages.filter(img => img && img !== displayImage)
          ].slice(0, 4);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // إذا تغيرت الصورة الرئيسية من الأعلى، نقوم بإعادة تعيين الحالة
    useEffect(() => {
        setActiveIndex(0);
        setIsLoading(true);
        setHasError(false);
    }, [mainImage]);

    if (!allImages || allImages.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                No images available
            </div>
        );
    }

    const handleThumbnailClick = (index) => {
        if (index !== activeIndex) {
            setIsLoading(true);
            setHasError(false);
            setActiveIndex(index);
        }
    };

    return (
        <div className="image-gallery-container flex flex-col gap-3 w-full">
            {/* حاوية الصورة الرئيسية */}
            <div className="main-image-wrapper relative w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {isLoading && !hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400">Loading image...</span>
                    </div>
                )}
                {hasError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
                        Image failed to load
                    </div>
                ) : (
                    <img
                        src={allImages[activeIndex]}
                        alt="Main listing view"
                        className={`main-display-image w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                )}
            </div>

            {/* شريط الصور المصغرة (يظهر فقط إذا كان هناك أكثر من صورة) */}
            {allImages.length > 1 && (
                <div className="thumbnail-row flex gap-3 overflow-x-auto py-1 hide-scrollbar">
                    {allImages.map((img, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleThumbnailClick(index)}
                            className={`thumbnail-wrapper relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ease-in-out ${
                                activeIndex === index
                                    ? 'active border-blue-600 opacity-100 scale-95'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className="thumbnail-image w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultCover;
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
