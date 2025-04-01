// utils/blue-api-helper.js
"use server"

import { getCache, setCacheItem } from './cache';

export async function fetchAndCacheData(path) {
    const cacheKey = `blue_${path}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3` + path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-TBA-Auth-Key': `${process.env.BLUE_API_KEY}`
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCacheItem(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}