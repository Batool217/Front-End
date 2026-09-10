import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MyListings from "./pages/MyListings";
import EditProfile from "./pages/EditProfile";
import EditListing from "./pages/EditListing";
import ListingDetails from "./pages/ListingDetails";
import UserProfile from "./pages/UserProfile";
import PrivateRoute from "./components/PrivateRoute";

import "./styles/css/auth.css";

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
            />
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
            />

            <Route path="/home" element={<Home />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/user/:id" element={<UserProfile />} />

            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/mylistings" element={<MyListings />} />
                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/edit-listing/:id" element={<EditListing />} />
            </Route>

            {/* Fallback */}
            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
            />
        </Routes>
    );
}

import "./i18n";

function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;