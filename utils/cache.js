// utils/cache.js
const cache = {};
const CACHE_TTL = 3600 * 1000; // Cache TTL of 1 hour in milliseconds

export function getCache(key) {
    const cachedData = cache[key];
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
        return cachedData.data;
    }
    return null;
}

export function setCacheItem(key, value) {
    cache[key] = { data: value, timestamp: Date.now() };
}

export function clearCache() {
    Object.keys(cache).forEach(key => delete cache[key]);
}