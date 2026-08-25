import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

import "./styles/css/auth.css";

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* If logged in, go directly to /home; otherwise, go to /login */}
            <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
            />

            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route
                path="/Login"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
            />

            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
            />
            <Route
                path="/Register"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
            />

            <Route path="/home" element={<Home />} />
            <Route path="/Home" element={<Home />} />

            {/* Fallback */}
            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
            />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;