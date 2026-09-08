export default function MetadataGrid({ category, facultyName, edition, postedDate }) {
    const isAcademic = category === "academic";
    const dateLabel = postedDate || "2 days ago";

    return (
        <div className="metadata-grid-container">
            {/* Faculty (Only for academic category) */}
            {isAcademic && facultyName && (
                <div className="metadata-item">
                    <span className="metadata-icon">🏛️</span>
                    <div className="metadata-info">
                        <span className="metadata-label">Faculty</span>
                        <span className="metadata-value">{facultyName}</span>
                    </div>
                </div>
            )}

            {/* Edition */}
            <div className="metadata-item">
                <span className="metadata-icon">📖</span>
                <div className="metadata-info">
                    <span className="metadata-label">Edition</span>
                    <span className="metadata-value">{edition || "Recent Edition"}</span>
                </div>
            </div>

            {/* Date Posted */}
            <div className="metadata-item">
                <span className="metadata-icon">📅</span>
                <div className="metadata-info">
                    <span className="metadata-label">Posted</span>
                    <span className="metadata-value">{dateLabel}</span>
                </div>
            </div>
        </div>
    );
}
