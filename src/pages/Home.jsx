import { useAuth } from "../context/AuthContext"; // 1. استيراد الـ Hook
import { useNavigate } from "react-router-dom";

function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/Login");
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Welcome to Waraq 📚</h1>
            <p>You are successfully logged in.</p>

            {user?.email && (
                <p style={{ marginTop: "10px", color: "#555" }}>
                    <strong>User:</strong> {user.email}
                </p>
            )}

            <button
                onClick={handleLogout}
                style={{
                    marginTop: "20px",
                    padding: "10px 18px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Log Out
            </button>
        </div>
    );
}

export default Home;