import { useState } from "react";
import "../styles/css/filter.css";

const GENERAL_CATEGORIES = [
    "Novels & Fiction",
    "Summaries & Notes",
    "Calculators & Tools",
    "Stationery",
    "Self-Help",
    "Other",
];

export default function GeneralFilter({ onFilterChange, onClear }) {
    const [selectedType, setSelectedType] = useState("");

    const handleSelect = (category) => {
        const nextValue = selectedType === category ? "" : category;
        setSelectedType(nextValue);
        if (onFilterChange) {
            onFilterChange({ type: nextValue });
        }
    };

    const handleClear = () => {
        setSelectedType("");
        if (onFilterChange) {
            onFilterChange({ type: "" });
        }
        if (onClear) {
            onClear();
        }
    };

    return (
        <div className="general-filter-body">
            <div className="filter-field">
                <label className="filter-field-label">Category / Item Type</label>
                <div className="filter-chip-grid">
                    {GENERAL_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`filter-chip-btn ${selectedType === category ? "active" : ""}`}
                            onClick={() => handleSelect(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Action Link */}
            <div className="filter-footer-action">
                <button type="button" className="clear-filters-link" onClick={handleClear}>
                    Clear Filters
                </button>
            </div>
        </div>
    );
}