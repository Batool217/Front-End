import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 1. فحص إرسال الـ OTP
  const sendOtp = async (e) => {
    e.preventDefault();

    setErrors({});

    const trimmedEmail = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!trimmedEmail) {
      setErrors({ email: "Email address is required" });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.message || "Unable to send OTP",
        });
        return;
      }

      setStep(2);

    } catch (error) {
      setErrors({ general: "Unable to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  // 2. فحص إعادة تعيين كلمة المرور
  const resetPassword = async (e) => {
    e.preventDefault();

    setErrors({});

    const newErr = {};
    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      newErr.otp = "OTP code is required";
    } else if (!/^\d{4,8}$/.test(trimmedOtp)) {
      newErr.otp = "OTP must be numeric (4-8 digits)";
    }

    if (!newPassword) {
      newErr.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErr.newPassword = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErr.newPassword = "Password must include at least one uppercase letter (A-Z)";
    } else if (!/[a-z]/.test(newPassword)) {
      newErr.newPassword = "Password must include at least one lowercase letter (a-z)";
    } else if (!/[0-9]/.test(newPassword)) {
      newErr.newPassword = "Password must include at least one number (0-9)";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      newErr.newPassword = "Password must include at least one special character (!@#$%^&*)";
    }

    if (Object.keys(newErr).length > 0) {
      setErrors(newErr);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: trimmedOtp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.message || "Invalid OTP or password",
        });
        return;
      }

      // النجاح والتوجيه للوجن
      navigate("/login");

    } catch (error) {
      setErrors({ general: "Unable to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {step === 1 ? (
          <>
            <h1>Forgot password?</h1>

            <p className="subtitle">
              Enter your email and we'll send you an OTP
            </p>

            {errors.general && (
              <div className="general-error">{errors.general}</div>
            )}

            <form onSubmit={sendOtp}>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="ahmad@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                />

                {errors.email && (
                  <span className="error">
                    {errors.email}
                  </span>
                )}
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

            </form>

            <button
              className="back-link"
              onClick={() => navigate("/login")}
            >
              ← Back to Login
            </button>
          </>
        ) : (
          <>
            <h1>Reset password</h1>

            <p className="subtitle">
              Enter the OTP sent to your email
            </p>

            {errors.general && (
              <div className="general-error">{errors.general}</div>
            )}

            <form onSubmit={resetPassword}>

              <div className="form-group">
                <label>OTP Code</label>

                <input
                  type="text"
                  placeholder="Enter OTP code"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setErrors({});
                  }}
                />

                {errors.otp && (
                  <span className="error">{errors.otp}</span>
                )}
              </div>

              <div className="form-group">
                <label>New Password</label>

                <input
                  type="password"
                  placeholder="At least 8 chars (A-z, 0-9, !@#)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors({});
                  }}
                />

                {errors.newPassword && (
                  <span className="error">{errors.newPassword}</span>
                )}
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </form>

            <button
              className="back-link"
              onClick={() => setStep(1)}
            >
              ← Change email
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;