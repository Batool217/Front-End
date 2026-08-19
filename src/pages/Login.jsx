import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome to Waraq 📚</h1>
      <p>You are successfully logged in.</p>

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
