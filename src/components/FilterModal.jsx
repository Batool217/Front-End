import React, { useState } from 'react';
import AcademicFilter from './AcademicFilter';
import GeneralFilter from './GeneralFilter';
import '../styles/css/filter.css';

const FilterModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('All');

    if (!isOpen) {
        return null;
    }

    const renderTabContent = () => {
        if (activeTab === 'Academic') {
            return <AcademicFilter />;
        }

        if (activeTab === 'General') {
            return <GeneralFilter />;
        }

        return <div>All Filters</div>;
    };

    return (
        <div className="filter-modal">
            <div className="filter-tabs">
                <button
                    type="button"
                    className={activeTab === 'All' ? 'active' : ''}
                    onClick={() => setActiveTab('All')}
                >
                    All
                </button>

                <button
                    type="button"
                    className={activeTab === 'Academic' ? 'active' : ''}
                    onClick={() => setActiveTab('Academic')}
                >
                    Academic
                </button>

                <button
                    type="button"
                    className={activeTab === 'General' ? 'active' : ''}
                    onClick={() => setActiveTab('General')}
                >
                    General
                </button>
            </div>

            <div className="filter-content">
                {renderTabContent()}
            </div>

            <button
                type="button"
                className="close-filter"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
};

export default FilterModal;