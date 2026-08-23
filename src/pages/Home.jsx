import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import RecentListings from "../components/RecentListings";
import FilterModal from "../components/FilterModal";
import PaperBackground from "../components/PaperBackground";

export default function Home() {
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleAddBook = () => {
        console.log("Open Add Book Modal / Navigate to Create Listing");
    };

    const handleFilterUpdate = (filters) => {
        console.log("Active Filters:", filters);
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                overflowX: "hidden",
                padding: "24px 48px 64px 48px",
                boxSizing: "border-box",
            }}
        >
            {/* Floating Ambient Background */}
            <PaperBackground />

            {/* Top Header - Given high z-index to float modals above main content */}
            <header
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    margin: "0 0 28px 0",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                }}
            >
                <div>
                    <h1 style={{ margin: 0, color: "#12345b", fontSize: "28px", fontWeight: "700" }}>
                        Welcome to Waraq 📚
                    </h1>
                    <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14.5px" }}>
                        Find & exchange university books
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Filter Popover Anchor */}
                    <div style={{ position: "relative" }}>
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            style={{
                                padding: "10px 18px",
                                backgroundColor: isFilterOpen ? "#ff851b" : "#ffffff",
                                color: isFilterOpen ? "#ffffff" : "#12345b",
                                border: "1.5px solid",
                                borderColor: isFilterOpen ? "#ff851b" : "#e2e8f0",
                                borderRadius: "10px",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                boxShadow: "0 2px 6px rgba(18, 52, 91, 0.04)",
                                transition: "all 0.2s ease",
                            }}
                        >
                            ⚡ Filter Books
                        </button>

                        <FilterModal
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            onFilterChange={handleFilterUpdate}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            padding: "10px 18px",
                            backgroundColor: "#ef4444",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)",
                            transition: "opacity 0.2s ease",
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main
                style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                }}
            >
                <HeroBanner onAddBook={handleAddBook} />
                <RecentListings />
            </main>
        </div>
    );
}