// utils/statbotics-api-helper.js
"use server"

import { getCache, setCacheItem } from './cache';

export async function fetchAndCacheData(path) {
    const cacheKey = `statbotics_${path}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch("https://api.statbotics.io/v3" + path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error("https://api.statbotics.io/v3" + path);
        }

        const data = await response.json();
        setCacheItem(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}