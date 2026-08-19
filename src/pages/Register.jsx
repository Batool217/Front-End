import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthVisualPanel from "../components/AuthVisualPanel";

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

    const trimmedName = form.fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(trimmedName)) {
      newErrors.fullName = "Full name must contain letters only";
    } else if (trimmedName.split(/\s+/).filter(Boolean).length < 2) {
      newErrors.fullName = "Please enter both first and last name";
    } else if (trimmedName.length < 3 || trimmedName.length > 50) {
      newErrors.fullName = "Full name must be between 3 and 50 characters";
    }

    const cleanedPhone = form.phoneNumber.replace(/[\s\-\(\)]/g, "");
    if (!cleanedPhone) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^(\+?\d{1,4})?\d{10,14}$/.test(cleanedPhone)) {
      newErrors.phoneNumber = "Enter a valid phone number (e.g. +962 79 123 4567)";
    }

    const trimmedEmail = form.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address (e.g. name@example.com)";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must include at least one uppercase letter (A-Z)";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Password must include at least one lowercase letter (a-z)";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Password must include at least one number (0-9)";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
      newErrors.password = "Password must include at least one special character (!@#$%^&*)";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const backendToFrontendField = {
    full_name: "fullName",
    phone_number: "phoneNumber",
    email: "email",
    password: "password",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const payload = {
      full_name: form.fullName,
      email: form.email,
      password: form.password,
      phone_number: form.phoneNumber,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const backendErrors = data.errors || {};

        const mappedErrors = {};
        Object.entries(backendErrors).forEach(([key, message]) => {
          const frontendKey = backendToFrontendField[key] || key;
          mappedErrors[frontendKey] = message;
        });

        setErrors(mappedErrors);
        return;
      }

      navigate("/login");
    } catch (error) {
      const msg = "Unable to connect to the server";
      setErrors({
        general: msg,
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
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Abdel rahman"
                value={form.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <span className="error">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="+962791234567"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <span className="error">{errors.phoneNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="At least 8 chars (A-z, 0-9, !@#)"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
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
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="auth-terms">
              By signing up you agree to our <a href="#">Terms</a> &amp;{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
