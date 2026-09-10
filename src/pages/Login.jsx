import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import AuthVisualPanel from "../components/AuthVisualPanel";
import PaperBackground from "../components/PaperBackground";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

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

      const userData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      };

      login(userData, data.token, form.rememberMe);
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
          <PaperBackground />
          <div className="auth-container">
            <h1>{t("auth.welcomeBack")}</h1>

            <p className="subtitle">{t("auth.signInSubtitle")}</p>

            <div className="auth-tabs">
              <button className="tab" onClick={() => navigate("/Register")}>
                {t("auth.signUp")}
              </button>

              <button className="tab active" onClick={() => navigate("/Login")}>
                {t("auth.logIn")}
              </button>
            </div>

            {errors.general && (
                <div className="general-error">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t("auth.emailLabel")}</label>
                <input
                    type="email"
                    name="email"
                    placeholder={t("auth.emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>{t("auth.passwordLabel")}</label>
                <input
                    type="password"
                    name="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    value={form.password}
                    onChange={handleChange}
                />
                {errors.password && (
                    <span className="error">{errors.password}</span>
                )}
              </div>

              <button
                  className="primary-button"
                  type="submit"
                  disabled={loading}
              >
                {loading ? t("auth.loggingIn") : t("auth.logIn")}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}

export default Login;