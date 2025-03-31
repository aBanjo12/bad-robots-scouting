"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

const CacheContext = createContext();

export function CacheProvider({ children }) {
    const [cache, setCache] = useState({});

    useEffect(() => {
        const storedCache = JSON.parse(localStorage.getItem('appCache')) || {};
        setCache(storedCache);
    }, []);

    const getCache = (key) => {
        return cache[key];
    };

    const setCacheItem = (key, value) => {
        const newCache = { ...cache, [key]: value };
        setCache(newCache);
        localStorage.setItem('appCache', JSON.stringify(newCache));
    };

    const clearCache = () => {
        setCache({});
        localStorage.removeItem('appCache');
    };

    return (
        <CacheContext.Provider value={{ getCache, setCacheItem, clearCache }}>
            {children}
        </CacheContext.Provider>
    );
}

export function useCacheContext() {
    return useContext(CacheContext);
}