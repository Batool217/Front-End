import { useState } from "react";
import "../styles/css/filter.css";

const GENERAL_SUBTYPES = [
    { label: "Book", value: "book" },
    { label: "Novel", value: "novel" },
];

export default function GeneralFilter({ onFilterChange, onClear }) {
    const [selectedType, setSelectedType] = useState("");

    const handleSelect = (val) => {
        const nextValue = selectedType === val ? "" : val;
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
                <label className="filter-field-label">Sub-Type</label>
                <div className="filter-chip-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {GENERAL_SUBTYPES.map((sub) => (
                        <button
                            key={sub.value}
                            type="button"
                            className={`filter-chip-btn ${selectedType === sub.value ? "active" : ""}`}
                            onClick={() => handleSelect(sub.value)}
                        >
                            {sub.label}
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