// [الخطوة 3]: إدارة التوجيه بين الصفحات (Routing)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// استيراد جميع الصفحات الرئيسية للمشروع
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

// استيراد ملف تنسيقات صفحات المصادقة (التسجيل والدخول)
import "./styles/css/auth.css";

function App() {
  return (
    // BrowserRouter: يوفر سياق التصفح بدون إعادة تحميل الصفحة بالكامل (SPA)
    <BrowserRouter>
      {/* Routes: الحاوية التي تفحص الرابط الحالي وتختار الصفحة المناسبة */}
      <Routes>
        {/* المسار الرئيسي '/' يعيد التوجيه تلقائياً إلى صفحة تسجيل الدخول '/login' */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* تعريف مسارات الصفحات المختلفة */}
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


