import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BookHeader from "./components/post-details/BookHeader";

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

        {/* مسار معاينة شاشتك (تاسك 3) */}
        <Route path="/book-header" element={
          <div style={{ 
            padding: "80px 24px", 
            maxWidth: "600px", 
            margin: "0 auto", 
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center" 
          }}>
            <BookHeader 
              title="Introduction to Algorithms, Fourth Edition"
              author="Thomas H. Cormen, Charles E. Leiserson"
              price="280"
              category="Academic"
              condition="Excellent"
              isExchangeable={true}
            />
          </div>
        } />

        {/* إعادة توجيه أي مسار غير معروف */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
