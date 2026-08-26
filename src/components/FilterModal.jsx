import { useState } from "react";
import AcademicFilter from "./AcademicFilter";
import GeneralFilter from "./GeneralFilter";
import "../styles/css/filter.css";

export default function FilterModal({ isOpen, onClose, onFilterChange }) {
    const [activeTab, setActiveTab] = useState("Academic");
    const [tempFilters, setTempFilters] = useState({
        academic: { universityId: "", facultyId: "", majorId: "" },
        general: { type: "" },
    });

    if (!isOpen) return null;

    const handleAcademicChange = (academicData) => {
        setTempFilters((prev) => ({ ...prev, academic: academicData }));
    };

    const handleGeneralChange = (generalData) => {
        setTempFilters((prev) => ({ ...prev, general: generalData }));
    };

    const handleApply = () => {
        if (onFilterChange) {
            onFilterChange({ activeTab, ...tempFilters });
        }
        onClose();
    };

    const handleClearAll = () => {
        const resetState = {
            academic: { universityId: "", facultyId: "", majorId: "" },
            general: { type: "" },
        };
        setTempFilters(resetState);
        if (onFilterChange) {
            onFilterChange({});
        }
        onClose();
    };

    return (
        <>
            {/* Click-outside backdrop */}
            <div className="filter-modal-backdrop" onClick={onClose} />

            <div className="filter-modal-container">
                {/* Tab Switcher */}
                <div className="filter-tabs">
                    {["Academic", "General", "All"].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            className={`filter-tab-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="filter-modal-body">
                    {activeTab === "Academic" && (
                        <AcademicFilter
                            onFilterChange={handleAcademicChange}
                            onClear={handleClearAll}
                        />
                    )}

                    {activeTab === "General" && (
                        <GeneralFilter
                            onFilterChange={handleGeneralChange}
                            onClear={handleClearAll}
                        />
                    )}

                    {activeTab === "All" && (
                        <div className="all-filters-wrapper">
                            <AcademicFilter
                                onFilterChange={handleAcademicChange}
                                onClear={handleClearAll}
                            />
                            <div className="filter-divider" />
                            <GeneralFilter
                                onFilterChange={handleGeneralChange}
                                onClear={handleClearAll}
                            />
                        </div>
                    )}
                </div>

                {/* Modal Footer with Apply and Close */}
                <div className="filter-modal-footer" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button type="button" className="close-filter-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="apply-filter-btn"
                        style={{
                            backgroundColor: "#f97316",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                        onClick={handleApply}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}