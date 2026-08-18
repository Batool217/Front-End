import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required");
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
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to send OTP"
        );
        return;
      }

      setStep(2);

    } catch (error) {
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    setError("");

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
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
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid OTP or password"
        );
        return;
      }

      // Password successfully changed
      navigate("/login");

    } catch (error) {
      setError("Unable to connect to the server");
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

            <form onSubmit={sendOtp}>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="ahmad@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />

                {error && (
                  <span className="error">
                    {error}
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

            <form onSubmit={resetPassword}>

              <div className="form-group">
                <label>OTP</label>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>

                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {error && (
                <span className="error">
                  {error}
                </span>
              )}

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