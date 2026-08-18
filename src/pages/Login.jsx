import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        /*
          Backend should ideally return something like:

          {
            "message": "Email is not registered",
            "code": "EMAIL_NOT_REGISTERED"
          }

          OR

          {
            "message": "Invalid email or password",
            "code": "INVALID_CREDENTIALS"
          }
        */

        if (
          data.code === "EMAIL_NOT_REGISTERED" ||
          data.error === "EMAIL_NOT_REGISTERED"
        ) {
          navigate("/register");
          return;
        }

        setError(
          data.message || "Invalid email or password"
        );

        return;
      }

      // Save authentication information
      if (data.token) {
        if (form.rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }
      }

      navigate("/home");

    } catch (error) {
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <h1>Welcome back</h1>

        <p className="subtitle">
          Sign in to your Waraq account
        </p>

        <div className="auth-tabs">

          <button
            className="tab"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>

          <button
            className="tab active"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="ahmad@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
            />

            {error && (
              <span className="error">
                {error}
              </span>
            )}
          </div>

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />

              <span>Remember me</span>

            </label>

            <button
              type="button"
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>

          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;