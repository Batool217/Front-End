import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  // هوك التنقل بين الصفحات
  const navigate = useNavigate();

  // 1. حالة Form: تخزين البريد وكلمة المرور وخيار "تذكرني"
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // 2. حالة الأخطاء وحالة التحميل
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // دالة تحديث القيم عند الكتابة أو تغيير الخيارات (تتطابق مع نوع الحقل)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    // تفريغ الأخطاء فور أن يبدأ المستخدم بالتعديل
    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });
  };

  // ==========================================
  // 🔍 [دالة التحقق - Validation]
  // ==========================================
  const validate = () => {
    const newErrors = {};

    const trimmedEmail = form.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 1. فحص البريد الإلكتروني
    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    // 2. فحص وجود كلمة المرور
    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // دالة الإرسال عند ضغط زر تسجيل الدخول
  const handleSubmit = async (e) => {
    e.preventDefault();

    // فحص البيانات أولاً قبل الإرسال للسيرفر
    if (!validate()) return;

    setLoading(true);

    try {
      // إرسال طلب تسجيل الدخول للـ Backend API
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
        // إذا كان البريد غير مسجل مسبقاً يوجه المستخدم تلقائياً لصفحة إنشاء الحساب
        if (
          data.code === "EMAIL_NOT_REGISTERED" ||
          data.error === "EMAIL_NOT_REGISTERED"
        ) {
          navigate("/register");
          return;
        }

        setErrors({
          general: data.message || "Invalid email or password",
        });

        return;
      }

      // حفظ الـ Token بناءً على خيار "Remember Me"
      if (data.token) {
        if (form.rememberMe) {
          localStorage.setItem("token", data.token); // حفظ دائم بالمتصفح
        } else {
          sessionStorage.setItem("token", data.token); // حفظ مؤقت للجلسة الحالية
        }
      }

      // التوجيه للصفحة الرئيسية عند نجاح تسجيل الدخول
      navigate("/home");

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

        <h1>Welcome back</h1>

        <p className="subtitle">
          Sign in to your Waraq account
        </p>

        {/* أزرار التنقل */}
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

        {/* عرض الخطأ العام (مثل خطأ السيرفر) */}
        {errors.general && (
          <div className="general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* حقل البريد الإلكتروني */}
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="ahmad@example.com"
              value={form.email}
              onChange={handleChange}
            />

            {/* رسالة خطأ الإيميل */}
            {errors.email && (
              <span className="error">
                {errors.email}
              </span>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
            />

            {/* رسالة خطأ كلمة المرور */}
            {errors.password && (
              <span className="error">
                {errors.password}
              </span>
            )}
          </div>

          {/* خيارات تسجيل الدخول */}
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

          </div>


          {/* زر تسجيل الدخول */}
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