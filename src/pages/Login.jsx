import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthVisualPanel from "../components/AuthVisualPanel";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    const trimmedEmail = form.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
        if (
            data.code === "EMAIL_NOT_REGISTERED" ||
            data.error === "EMAIL_NOT_REGISTERED"
        ) {
          navigate("/Register");
          return;
        }

        setErrors({
          general: data.message || "Invalid email or password",
        });

        return;
      }

      if (data.token) {
        if (form.rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }
      }

      navigate("/Home");

    } catch {
      setErrors({
        general: "Unable to connect to the server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="auth-page">
        <AuthVisualPanel />

        <div className="auth-form-panel">
          <div className="auth-container">

            <h1>Welcome back</h1>

            <p className="subtitle">
              Sign in to your Waraq account
            </p>

            <div className="auth-tabs">

              <button
                  className="tab"
                  onClick={() => navigate("/Register")}
              >
                Sign Up
              </button>

              <button
                  className="tab active"
                  onClick={() => navigate("/Login")}
              >
                Log In
              </button>

            </div>

            {errors.general && (
                <div className="general-error">
                  {errors.general}
                </div>
            )}

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

                {errors.email && (
                    <span className="error">
                {errors.email}
              </span>
                )}
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

                {errors.password && (
                    <span className="error">
                {errors.password}
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

                {/*<a className="forgot-link" href="#">*/}
                {/*  Forgot password?*/}
                {/*</a>*/}

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
      </div>
  );
}

export default Login;