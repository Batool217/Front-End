import React, { useState } from 'react';
import '../styles/css/filter.css';

const GeneralFilter = () => {
    const [selectedType, setSelectedType] = useState('');

    const handleClear = () => {
        setSelectedType('');
    };

    return (
        <div className="general-filter">
            <label>Type</label>

            <div className="filter-options">
                <button
                    type="button"
                    className={selectedType === 'Books' ? 'active' : ''}
                    onClick={() => setSelectedType('Books')}
                >
                    Books
                </button>

                <button
                    type="button"
                    className={selectedType === 'Novels' ? 'active' : ''}
                    onClick={() => setSelectedType('Novels')}
                >
                    Novels
                </button>
            </div>

            <button
                type="button"
                className="clear-filters"
                onClick={handleClear}
            >
                Clear Filters
            </button>
        </div>
    );
};

export default GeneralFilter;