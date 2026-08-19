import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* التوجيه الافتراضي إلى صفحة الدخول */}
                <Route path="/" element={<Navigate to="/Login" />} />

                <Route path="/Login" element={<Login />} />

                {/* المسار المحمي - تأكد من مطابقة حرف H الكبير */}
                <Route
                    path="/Home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />

                {/* إعادة توجيه أي مسار غير معروف */}
                <Route path="*" element={<Navigate to="/Login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;