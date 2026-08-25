import { useState, useEffect } from "react";
import "../styles/css/filter.css";

export default function AcademicFilter({ onFilterChange, onClear }) {
    const [universities, setUniversities] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);

    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");

    // 1. Fetch Universities on mount
    useEffect(() => {
        let isMounted = true;

        fetch("http://localhost:8080/api/universities")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (isMounted) {
                    setUniversities(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                console.error("Error loading universities:", err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Fetch Faculties on university change
    useEffect(() => {
        if (!selectedUniversity) return;

        let isMounted = true;

        fetch(`http://localhost:8080/api/faculties?university_id=${selectedUniversity}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (isMounted) {
                    setFaculties(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                console.error("Error loading faculties:", err);
            });

        return () => {
            isMounted = false;
        };
    }, [selectedUniversity]);

    // 3. Fetch Majors on faculty change
    useEffect(() => {
        if (!selectedFaculty) return;

        let isMounted = true;

        fetch(`http://localhost:8080/api/majors?faculty_id=${selectedFaculty}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (isMounted) {
                    setMajors(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                console.error("Error loading majors:", err);
            });

        return () => {
            isMounted = false;
        };
    }, [selectedFaculty]);

    const handleUniversityChange = (e) => {
        const universityId = e.target.value;
        setSelectedUniversity(universityId);
        setSelectedFaculty("");
        setSelectedMajor("");
        setFaculties([]);
        setMajors([]);

        if (onFilterChange) {
            onFilterChange({
                universityId: universityId || "",
                facultyId: "",
                majorId: "",
            });
        }
    };

    const handleFacultyChange = (e) => {
        const facultyId = e.target.value;
        setSelectedFaculty(facultyId);
        setSelectedMajor("");
        setMajors([]);

        if (onFilterChange) {
            onFilterChange({
                universityId: selectedUniversity,
                facultyId: facultyId || "",
                majorId: "",
            });
        }
    };

    const handleMajorChange = (e) => {
        const majorId = e.target.value;
        setSelectedMajor(majorId);

        if (onFilterChange) {
            onFilterChange({
                universityId: selectedUniversity,
                facultyId: selectedFaculty,
                majorId: majorId || "",
            });
        }
    };

    const handleClear = () => {
        setSelectedUniversity("");
        setSelectedFaculty("");
        setSelectedMajor("");
        setFaculties([]);
        setMajors([]);

        if (onClear) {
            onClear();
        } else if (onFilterChange) {
            onFilterChange({ universityId: "", facultyId: "", majorId: "" });
        }
    };

    return (
        <div className="academic-filter-body">
            {/* University Dropdown */}
            <div className="filter-field">
                <label className="filter-field-label">University</label>
                <div className="filter-select-box">
                    <select
                        value={selectedUniversity}
                        onChange={handleUniversityChange}
                    >
                        <option value="">Select university</option>
                        {universities.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
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
                        value={selectedFaculty}
                        onChange={handleFacultyChange}
                        disabled={!selectedUniversity}
                    >
                        <option value="">
                            {!selectedUniversity ? "Select university first" : "Select faculty"}
                        </option>
                        {faculties.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
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
                        value={selectedMajor}
                        onChange={handleMajorChange}
                        disabled={!selectedFaculty}
                    >
                        <option value="">
                            {!selectedFaculty ? "Select faculty first" : "Select major"}
                        </option>
                        {majors.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
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