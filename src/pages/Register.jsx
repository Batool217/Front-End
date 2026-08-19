import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  // هوك التنقل بين الصفحات في React Router
  const navigate = useNavigate();

  // 1. حالة النموذج (Form State): تخزين ما يكتبه المستخدم بالنموذج
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  // 2. حالة الأخطاء (Errors State): تخزين رسائل الأخطاء لكل حقل
  const [errors, setErrors] = useState({});

  // 3. حالة التحميل (Loading State): لتعطيل الزر أثناء إرسال البيانات
  const [loading, setLoading] = useState(false);

  // دالة تُستدعى فوراً مع كل حرف يكتبه المستخدم في الحقول
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // تفريغ خطأ الحقل الحالي فور أن يبدأ المستخدم بالتعديل
    setErrors({
      ...errors,
      [e.target.name]: "",
      general: "",
    });
  };

  // =======================================================
  // 🔍 [دالة التحقق الدقيق جداً من صحة البيانات - Strict Validation]
  // =======================================================
  const validate = () => {
    const newErrors = {};

    // 1. فحص الاسم الكامل (Full Name): فارغ؟ حروف فقط؟ اسم أول وعائلة؟ طول مناسب؟
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

    // 2. فحص رقم الهاتف (Phone Number): فارغ؟ صيغة أرقام صحيحة؟
    const cleanedPhone = form.phoneNumber.replace(/[\s\-\(\)]/g, "");
    if (!cleanedPhone) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^(\+?\d{1,4})?\d{10,14}$/.test(cleanedPhone)) {
      newErrors.phoneNumber = "Enter a valid phone number (e.g. +962 79 123 4567)";
    }

    // 3. فحص البريد الإلكتروني (Email Address): فارغ؟ صيغة إيميل صحيحة؟
    const trimmedEmail = form.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address (e.g. name@example.com)";
    }

    // 4. فحص كلمة المرور المعقدة (Password Complexity): طول 8+، حرف كبير، حرف صغير، رقم، رمز خاص
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

    // حفظ كائن الأخطاء في الـ State
    setErrors(newErrors);

    // ترجع true فقط إذا لم تكن هناك أي أخطاء (عدد الأخطاء 0)
    return Object.keys(newErrors).length === 0;
  };

  // دالة إرسال النموذج عند ضغط زر Submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة الافتراضي

    // خطوة الـ Validation الإلزامية قبل الإرسال للباك إند
    if (!validate()) return; // إيقاف الإرسال فوراً إذا فشل الفحص

    setLoading(true);

    try {
      // إرسال طلب إنشاء حساب جديد للـ API
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      // التعامل مع أخطاء السيرفر (مثل الإيميل مسجل مسبقاً)
      if (!response.ok) {
        setErrors({
          general: data.message || "Registration failed",
          email: data.field === "email" ? data.message : "",
        });
        return;
      }

      // التسجيل نجح -> التوجيه لصفحة تسجيل الدخول
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

        {/* أزرار التنقل بين التسجيل والدخول */}
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

        {/* عرض الخطأ العام (مثل خطأ الاتصال بالسيرفر) */}
        {errors.general && (
          <div className="general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            {/* حقل الاسم الكامل */}
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                placeholder="Abde rahman"
                value={form.fullName}
                onChange={handleChange}
              />

              {/* عرض رسالة الخطأ الخاصة بالاسم في حال وجودها */}
              {errors.fullName && (
                <span className="error">
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* حقل رقم الهاتف */}
            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phoneNumber"
                placeholder="+962791234567"
                value={form.phoneNumber}
                onChange={handleChange}
              />

              {/* عرض رسالة الخطأ الخاصة برقم الهاتف */}
              {errors.phoneNumber && (
                <span className="error">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

          </div>

          {/* حقل البريد الإلكتروني */}
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Abde rahman@example.com"
              value={form.email}
              onChange={handleChange}
            />

            {/* عرض رسالة الخطأ الخاصة بالبريد */}
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
              placeholder="At least 8 chars (A-z, 0-9, !@#)"
              value={form.password}
              onChange={handleChange}
            />

            {/* عرض رسالة الخطأ الخاصة بكلمة المرور */}
            {errors.password && (
              <span className="error">
                {errors.password}
              </span>
            )}
          </div>

          {/* زر الإرسال مع حالة التحميل */}
          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>



      </div>
    </div>
  );
}

export default Register;




