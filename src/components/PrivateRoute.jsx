import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // 1. الانتظار حتى ينتهي المفتش التلقائي من قراءة الـ LocalStorage
    if (loading) {
        return <div style={{ padding: '20px' }}>جاري التحميل...</div>;
    }

    // 2. شرط الحماية الرئيسي
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;