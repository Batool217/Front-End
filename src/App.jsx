import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

import "./styles/css/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* التوجيه الافتراضي إلى صفحة الدخول */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* مسارات الصفحات الأساسية */}
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />

        {/* إعادة توجيه أي مسار غير معروف */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
