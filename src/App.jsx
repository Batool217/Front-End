import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BookHeader from "./components/post-details/BookHeader";
import PostDetails from "./pages/PostDetails";

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
            
            <Route path="/listings/:id" element={<PostDetails />} />

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