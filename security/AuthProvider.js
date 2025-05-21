import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api'; // Ton axios configuré
// Si atob n'existe pas (React Native), on utilise un polyfill :
import { decode as atob } from 'base-64';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadToken();
    }, []);

    const loadToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                const decoded = parseJwt(storedToken);
                setUser({ id: decoded.sub, email: decoded.email });
            }
        } catch (e) {
            console.warn('Token loading failed', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Appel l'API mobile sur /api/login (avec API.post)
            const response = await API.post('/api/login', { email, password });
            const jwt = response.data.token;
            await AsyncStorage.setItem('token', jwt);
            setToken(jwt);
            const decoded = parseJwt(jwt);
            setUser({ id: decoded.sub, email: decoded.email });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Polyfill atob pour React Native (si ce n'est pas importé)
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch (e) {
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
