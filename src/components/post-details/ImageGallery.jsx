import React, { useState } from 'react';

const ImageGallery = ({ images = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (!images || images.length === 0) {
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
        <div className="flex flex-col gap-3 w-full">
            {/* حاوية الصورة الرئيسية */}
            <div className="relative w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
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
                        src={images[activeIndex]}
                        alt="Main listing view"
                        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                )}
            </div>

            {/* شريط الصور المصغرة (يظهر فقط إذا كان هناك أكثر من صورة) */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-1 hide-scrollbar">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ease-in-out ${
                                activeIndex === index
                                    ? 'border-blue-600 opacity-100 scale-95'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;