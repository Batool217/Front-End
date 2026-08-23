import { useState } from "react";
import "../styles/css/filter.css";

const UNIVERSITIES = [
    { value: "uoj", label: "University of Jordan" },
    { value: "just", label: "Jordan University of Science & Technology" },
    { value: "yu", label: "Yarmouk University" },
    { value: "hu", label: "Hashemite University" },
    { value: "bau", label: "Al-Balqa Applied University" },
    { value: "mutah", label: "Mutah University" },
];

const FACULTIES = [
    { value: "it", label: "Faculty of Information Technology" },
    { value: "engineering", label: "Faculty of Engineering" },
    { value: "science", label: "Faculty of Science" },
    { value: "business", label: "Faculty of Business" },
    { value: "medicine", label: "Faculty of Medicine" },
    { value: "arts", label: "Faculty of Arts" },
];

const MAJORS = [
    { value: "cs", label: "Computer Science" },
    { value: "cis", label: "Computer Information Systems" },
    { value: "se", label: "Software Engineering" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "cyber", label: "Cybersecurity" },
    { value: "ce", label: "Computer Engineering" },
];

export default function AcademicFilter({ onFilterChange, onClear }) {
    const [academicFilters, setAcademicFilters] = useState({
        university: "",
        faculty: "",
        major: "",
    });

    const handleChange = (field, value) => {
        const updated = { ...academicFilters, [field]: value };
        setAcademicFilters(updated);
        if (onFilterChange) {
            onFilterChange(updated);
        }
    };

    const handleClear = () => {
        const reset = { university: "", faculty: "", major: "" };
        setAcademicFilters(reset);
        if (onFilterChange) {
            onFilterChange(reset);
        }
        if (onClear) {
            onClear();
        }
    };

    return (
        <div className="academic-filter-body">
            {/* University Dropdown */}
            <div className="filter-field">
                <label className="filter-field-label">University</label>
                <div className="filter-select-box">
                    <select
                        value={academicFilters.university}
                        onChange={(e) => handleChange("university", e.target.value)}
                    >
                        <option value="">Select university</option>
                        {UNIVERSITIES.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Faculty Dropdown */}
            <div className="filter-field">
                <label className="filter-field-label">Faculty</label>
                <div className="filter-select-box">
                    <select
                        value={academicFilters.faculty}
                        onChange={(e) => handleChange("faculty", e.target.value)}
                    >
                        <option value="">Select faculty</option>
                        {FACULTIES.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Major Dropdown */}
            <div className="filter-field">
                <label className="filter-field-label">Major</label>
                <div className="filter-select-box">
                    <select
                        value={academicFilters.major}
                        onChange={(e) => handleChange("major", e.target.value)}
                    >
                        <option value="">Select major</option>
                        {MAJORS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
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