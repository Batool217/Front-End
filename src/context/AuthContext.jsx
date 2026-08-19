import { createContext, useContext, useState } from 'react';

// 1. تمرير null لمنع تحذير القيمة الافتراضية
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 2. استخدام Lazy Initialization لقراءة البيانات فورياً دون الحاجة لـ useEffect
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) return null;
        try {
            return JSON.parse(savedUser);
        } catch {
            return { email: savedUser };
        }
    });

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 3. إضافة تعليق ESLint لمنع تحذير Fast Refresh والحفاظ على الـ Hook بنفس الملف
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};