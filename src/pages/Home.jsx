import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroBanner from "../components/HeroBanner";
import RecentListings from "../components/RecentListings";
import PaperBackground from "../components/PaperBackground";
import Navbar from "../components/Navbar";
import AddBookModal from "../components/AddBookModal";

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [isAddBookOpen, setIsAddBookOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleAddBookClick = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setIsAddBookOpen(true);
    };

    const handleBookCreated = () => {
        setRefreshTrigger((prev) => prev + 1);
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

            {/* Top Navigation Bar */}
            <div style={{ position: "relative", zIndex: 100, margin: "0 0 28px 0" }}>
                <Navbar
                    onSearch={(query) => setSearchQuery(query)}
                    onFilterChange={(newFilters) => setFilters(newFilters)}
                    onLogout={handleLogout}
                />
            </div>

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
                <HeroBanner onAddBook={handleAddBookClick} />
                <RecentListings
                    searchQuery={searchQuery}
                    filters={filters}
                    refreshTrigger={refreshTrigger}
                />
            </main>

            {/* Add Book Modal Form */}
            <AddBookModal
                isOpen={isAddBookOpen}
                onClose={() => setIsAddBookOpen(false)}
                onBookAdded={handleBookCreated}
            />
        </div>
    );
}