import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import * as authService from '../services/auth.service';
import { AUTH_STATUS_EVENT } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isRefreshingRef = useRef(false);

    const refreshUser = useCallback(async () => {
        if (isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;
        try {
            const data = await authService.getMe();
            setUser(data.data.user);
        } catch (error) {
            if (error.status === 401) {
                setUser(null);
                return;
            }

            throw error;
        } finally {
            isRefreshingRef.current = false;
        }
    }, []);

    useEffect(() => {
        refreshUser()
            .catch(() => null)
            .finally(() => setLoading(false));
    }, [refreshUser]);

    useEffect(() => {
        const handleAuthStatusChanged = async () => {
            try {
                await refreshUser();
            } catch (_error) {
                // Non-auth failures should not break the app shell.
            }
        };

        window.addEventListener(AUTH_STATUS_EVENT, handleAuthStatusChanged);
        return () => window.removeEventListener(AUTH_STATUS_EVENT, handleAuthStatusChanged);
    }, [refreshUser]);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setUser(data.data.user);
            return data;
        } catch (error) {
            const message = error.response?.data?.error || error.message || 'Login failed';
            throw new Error(message);
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await authService.register(name, email, password);
            setUser(data.data.user);
            return data;
        } catch (error) {
            const message = error.response?.data?.error || error.message || 'Registration failed';
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {loading ? (
                <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center font-sans selection:bg-black selection:text-white">
                    <div className="w-14 h-14 bg-[#111] rounded-2xl flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-xl animate-pulse mb-6">
                        CNC
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-[#111] rounded-full animate-spin"></div>
                        <span className="text-gray-500 font-bold text-sm tracking-wide">AUTHENTICATING</span>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
