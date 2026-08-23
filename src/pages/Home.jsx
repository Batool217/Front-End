import { useNavigate } from "react-router-dom";
import RecentListings from "../components/RecentListings";

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f8fafc", padding: "30px 40px" }}>
            {/* Top Header */}
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: "1200px",
                    margin: "0 auto 30px auto",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #e2e8f0",
                }}
            >
                <div>
                    <h1 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: "700" }}>
                        Welcome to Waraqa 📚
                    </h1>
                    <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
                        Find & exchange university books
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "10px 18px",
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                >
                    Log Out
                </button>
            </header>

            {/* Main Content (Recent Listings Grid) */}
            <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <RecentListings />
            </main>
        </div>
    );
}

export default Home;