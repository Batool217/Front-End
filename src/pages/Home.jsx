import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import RecentListings from "../components/RecentListings";
import PaperBackground from "../components/PaperBackground";
import Navbar from "../components/Navbar";

export default function Home() {
    const navigate = useNavigate();

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

            {/* Top Navigation Bar */}
            <div style={{ position: "relative", zIndex: 100, margin: "0 0 28px 0" }}>
                <Navbar
                    onSearch={(query) => console.log("Searching:", query)}
                    onFilterChange={handleFilterUpdate}
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
                <HeroBanner onAddBook={handleAddBook} />
                <RecentListings />
            </main>
        </div>
    );
}