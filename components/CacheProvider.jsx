"use client"

import React, { createContext, useContext, useState } from "react";

const CacheContext = createContext();

export function CacheProvider({ children }) {
    const [cache, setCache] = useState({});

    const getCache = (key) => {
        return cache[key];
    };

    const setCacheItem = (key, value) => {
        const newCache = { ...cache, [key]: value };
        setCache(newCache);
    };

    const clearCache = () => {
        setCache({});
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