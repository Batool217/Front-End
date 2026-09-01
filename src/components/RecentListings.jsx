import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import "../styles/css/listings.css";

function RecentListings({ searchQuery = "", filters = {}, refreshTrigger = 0 }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const params = new URLSearchParams();

        if (searchQuery && searchQuery.trim()) {
            params.append("search", searchQuery.trim());
        }

        if (filters.activeTab === "Academic") {
            params.append("category", "academic");
            if (filters.academic?.universityId) {
                params.append("university_id", filters.academic.universityId);
            }
            if (filters.academic?.facultyId) {
                params.append("faculty_id", filters.academic.facultyId);
            }
            if (filters.academic?.majorId) {
                params.append("major_id", filters.academic.majorId);
            }
        } else if (filters.activeTab === "General") {
            // 1. Always restrict to category = general when on General tab
            params.append("category", "general");

            // 2. If 'book' or 'novel' is explicitly selected, filter by sub_type
            if (filters.general?.type) {
                params.append("sub_type", filters.general.type);
            }
        }

        params.append("limit", "8");

        fetch(`http://localhost:8080/api/books?${params.toString()}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load books feed.");
                return res.json();
            })
            .then((data) => {
                setBooks(Array.isArray(data) ? data : []);
                setError(null);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Error fetching books:", err);
                    setError("Unable to load books. Please try again later.");
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, [searchQuery, filters, refreshTrigger]);

    return (
        <section className="recent-listings">
            <div className="listings-header">
                <div className="listings-title">
                    <h2>Recent Listings</h2>
                    <span className="results-badge">{books.length} results</span>
                </div>

                <a href="#" className="view-all">
                    View all →
                </a>
            </div>

            {loading && (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#64748b" }}>
                    Loading available books...
                </div>
            )}

            {error && (
                <div style={{ padding: "20px", textAlign: "center", color: "#ef4444" }}>
                    {error}
                </div>
            )}

            {!loading && !error && books.length === 0 && (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#64748b" }}>
                    No books found matching your search criteria.
                </div>
            )}

            {!loading && !error && books.length > 0 && (
                <div className="listings-grid">
                    {books.map((book) => (
                        <BookCard
                            key={book.id || book.bookId}
                            id={book.id || book.bookId}
                            title={book.title}
                            price={book.price}
                            coverImage={book.coverImage || (book.imagesUrl && book.imagesUrl[0])}
                            type={book.type}
                            category={book.category}
                            onClick={(id) => console.log("Clicked book id:", id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default RecentListings;