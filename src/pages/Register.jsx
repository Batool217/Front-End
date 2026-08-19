import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      general: "",
    });
  };
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = form;

      const response = await fetch(
          "http://localhost:8080/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData),
          }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.message || "Registration failed",
          email:
            data.field === "email"
              ? data.message
              : "",
        });

        return;
      }

      // Registration successful
      // Do NOT auto-login
      navigate("/login");
    } catch (error) {
      setErrors({
        general: "Unable to connect to the server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <h1>Create your account</h1>

        <p className="subtitle">
          Join thousands of students buying and selling books
        </p>

        <div className="auth-tabs">
          <button
            className="tab active"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>

          <button
            className="tab"
            onClick={() => navigate("/login")}
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

          <div className="form-row">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                placeholder="Ahmad Al-Khatib"
                value={form.fullName}
                onChange={handleChange}
              />

              {errors.fullName && (
                <span className="error">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phoneNumber"
                placeholder="+962 79 123 4567"
                value={form.phoneNumber}
                onChange={handleChange}
              />

              {errors.phoneNumber && (
                <span className="error">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

          </div>

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
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
            />

            {errors.password && (
              <span className="error">
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
            />

            {errors.confirmPassword && (
                <span className="error">
      {errors.confirmPassword}
    </span>
            )}
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="terms">
          By signing up you agree to our{" "}
          <strong>Terms</strong> &{" "}
          <strong>Privacy Policy</strong>
        </p>

      </div>
    </div>
  );
}

export default Register;