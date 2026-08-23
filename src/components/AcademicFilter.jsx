import { useState } from "react";
import "../styles/css/filter.css";

const FILTER_OPTIONS = {
    university: [
        { value: "uoj", label: "University of Jordan" },
        { value: "just", label: "Jordan University of Science & Technology" },
        { value: "yu", label: "Yarmouk University" },
        { value: "ahu", label: "Al-Hussein Bin Talal University" },
        { value: "mut", label: "Mutah University" },
    ],
    faculty: [
        { value: "engineering", label: "Faculty of Engineering" },
        { value: "science", label: "Faculty of Science" },
        { value: "it", label: "Faculty of Information Technology" },
        { value: "business", label: "Faculty of Business" },
        { value: "medicine", label: "Faculty of Medicine" },
        { value: "arts", label: "Faculty of Arts" },
    ],
    subject: [
        { value: "cs", label: "Computer Science" },
        { value: "ce", label: "Computer Engineering" },
        { value: "ee", label: "Electrical Engineering" },
        { value: "me", label: "Mechanical Engineering" },
        { value: "ba", label: "Business Administration" },
        { value: "bio", label: "Biology" },
        { value: "math", label: "Mathematics" },
        { value: "physics", label: "Physics" },
        { value: "chemistry", label: "Chemistry" },
    ],
};

const LEVELS = ["Undergraduate", "Postgraduate", "PhD", "Diploma"];

const DEFAULT_FILTERS = {
    levels: [],
    university: "",
    faculty: "",
    subject: "",
};

export default function AcademicFilter({ isOpen = true, onClose, onSelectFilter, onClear }) {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const handleLevelChange = (level) => {
        const updated = filters.levels.includes(level)
            ? filters.levels.filter((l) => l !== level)
            : [...filters.levels, level];
        setFilters((prev) => ({ ...prev, levels: updated }));
    };

    const handleDropdownChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleClear = () => {
        setFilters(DEFAULT_FILTERS);
        if (onClear) onClear();
    };

    const handleApply = () => {
        if (onSelectFilter) onSelectFilter(filters);
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop overlay */}
            {onClose && <div className="filter-backdrop" onClick={onClose} />}

            <div className={`academic-filter-container ${onClose ? "filter-drawer" : ""}`}>
                {/* Header */}
                <div className="filter-header">
                    <h3>Academic Filter</h3>
                    {onClose && (
                        <button className="filter-close-btn" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    )}
                </div>

                {/* Level Checkboxes */}
                <div className="filter-group">
                    <label className="filter-group-title">Degree Level</label>
                    <div className="checkbox-grid">
                        {LEVELS.map((level) => (
                            <label key={level} className="checkbox-pill">
                                <input
                                    type="checkbox"
                                    checked={filters.levels.includes(level)}
                                    onChange={() => handleLevelChange(level)}
                                />
                                <span>{level}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* University Dropdown */}
                <div className="filter-group">
                    <label className="filter-group-title">University</label>
                    <div className="select-wrapper">
                        <select
                            className="filter-select"
                            value={filters.university}
                            onChange={(e) => handleDropdownChange("university", e.target.value)}
                        >
                            <option value="">All Universities</option>
                            {FILTER_OPTIONS.university.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Faculty Dropdown */}
                <div className="filter-group">
                    <label className="filter-group-title">Faculty / College</label>
                    <div className="select-wrapper">
                        <select
                            className="filter-select"
                            value={filters.faculty}
                            onChange={(e) => handleDropdownChange("faculty", e.target.value)}
                        >
                            <option value="">All Faculties</option>
                            {FILTER_OPTIONS.faculty.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Subject Dropdown */}
                <div className="filter-group">
                    <label className="filter-group-title">Subject / Major</label>
                    <div className="select-wrapper">
                        <select
                            className="filter-select"
                            value={filters.subject}
                            onChange={(e) => handleDropdownChange("subject", e.target.value)}
                        >
                            <option value="">All Subjects</option>
                            {FILTER_OPTIONS.subject.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                    <button className="clear-filters-btn" onClick={handleClear} type="button">
                        Reset
                    </button>
                    <button className="apply-filters-btn" onClick={handleApply} type="button">
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}