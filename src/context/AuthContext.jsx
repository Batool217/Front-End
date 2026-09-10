import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const API_BASE = "http://localhost:8080/api/v1";

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
                await fetch(`${API_BASE}/auth/logout`, {
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

    const updateUser = useCallback((updatedFields) => {
        setUser((prev) => {
            const updated = { ...(prev || {}), ...updatedFields };
            const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Sync profile details if token exists
    useEffect(() => {
        if (!token) return;

        let isMounted = true;

        const syncProfile = async () => {
            try {
                const res = await fetch(`${API_BASE}/users/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (res.status === 401) {
                    if (isMounted) clearAuthData();
                    return;
                }
                if (!res.ok) return;

                const basicUser = await res.json();
                const userId = basicUser.user_id || basicUser.userId || basicUser.id;

                let fullProfile = {};
                if (userId) {
                    try {
                        const fullRes = await fetch(`${API_BASE}/users/${userId}/profile`, {
                            headers: { "Authorization": `Bearer ${token}` },
                        });
                        if (fullRes.ok) {
                            fullProfile = await fullRes.json();
                        }
                    } catch (e) {
                        console.error("Failed to load full profile card:", e);
                    }
                }

                if (isMounted) {
                    const mergedUser = {
                        ...basicUser,
                        ...fullProfile,
                        name: fullProfile.full_name || fullProfile.name || basicUser.name,
                        profile_image: fullProfile.profile_image || fullProfile.profileImage || basicUser.profile_image,
                    };
                    setUser(mergedUser);
                    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
                    storage.setItem("user", JSON.stringify(mergedUser));
                }
            } catch (err) {
                console.error("Profile sync error:", err);
            }
        };

        void syncProfile();

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
                updateUser,
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