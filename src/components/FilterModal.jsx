import { useState } from "react";
import AcademicFilter from "./AcademicFilter";
import GeneralFilter from "./GeneralFilter";
import "../styles/css/filter.css";

export default function FilterModal({ isOpen, onClose, onFilterChange }) {
    const [activeTab, setActiveTab] = useState("Academic");
    const [filtersState, setFiltersState] = useState({
        academic: { university: "", faculty: "", major: "" },
        general: { type: "" },
    });

    if (!isOpen) return null;

    const handleAcademicChange = (academicData) => {
        const updated = { ...filtersState, academic: academicData };
        setFiltersState(updated);
        if (onFilterChange) {
            onFilterChange({ activeTab, ...updated });
        }
    };

    const handleGeneralChange = (generalData) => {
        const updated = { ...filtersState, general: generalData };
        setFiltersState(updated);
        if (onFilterChange) {
            onFilterChange({ activeTab, ...updated });
        }
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (onFilterChange) {
            onFilterChange({ activeTab: tab, ...filtersState });
        }
    };

    return (
        <>
            {/* Click-outside backdrop */}
            <div className="filter-modal-backdrop" onClick={onClose} />

            <div className="filter-modal-container">
                {/* Tab Switcher Header */}
                <div className="filter-tabs">
                    {["Academic", "General", "All"].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            className={`filter-tab-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => handleTabSwitch(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content Body */}
                <div className="filter-modal-body">
                    {activeTab === "Academic" && (
                        <AcademicFilter onFilterChange={handleAcademicChange} />
                    )}

                    {activeTab === "General" && (
                        <GeneralFilter onFilterChange={handleGeneralChange} />
                    )}

                    {activeTab === "All" && (
                        <div className="all-filters-wrapper">
                            <AcademicFilter onFilterChange={handleAcademicChange} />
                            <div className="filter-divider" />
                            <GeneralFilter onFilterChange={handleGeneralChange} />
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="filter-modal-footer">
                    <button type="button" className="close-filter-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}