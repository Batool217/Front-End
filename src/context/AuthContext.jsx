import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
    });

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!savedUser) return null;
        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    });

    const clearAuthData = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    }, []);

    const logout = useCallback(async () => {
        const currentToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (currentToken) {
            try {
                await fetch("http://localhost:8080/api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${currentToken}`,
                        "Content-Type": "application/json",
                    },
                });
            } catch (err) {
                console.error("Logout request error:", err);
            }
        }
        clearAuthData();
    }, [clearAuthData]);

    const login = useCallback((userData, authToken, rememberMe = true) => {
        setUser(userData);
        setToken(authToken);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", authToken);
        if (userData) {
            storage.setItem("user", JSON.stringify(userData));
        }
    }, []);

    // Sync profile details if token exists
    useEffect(() => {
        if (!token) return;

        let isMounted = true;

        fetch("http://localhost:8080/api/users/profile", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    if (isMounted) clearAuthData();
                    return null;
                }
                return res.ok ? res.json() : null;
            })
            .then((profileData) => {
                if (isMounted && profileData) {
                    setUser(profileData);
                    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
                    storage.setItem("user", JSON.stringify(profileData));
                }
            })
            .catch((err) => {
                console.error("Profile sync error:", err);
            });

        return () => {
            isMounted = false;
        };
    }, [token, clearAuthData]);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};