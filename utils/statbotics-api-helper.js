import {useCacheContext} from "@/components/CacheProvider"

export function useSetupCache() {
    const { getCache, setCacheItem } = useCacheContext();

    // Prepopulate cache if needed
    if (!getCache('initialSetup')) {
        setCacheItem('initialSetup', true);
    }
}

export async function makeRequest(path) {
    if (typeof path !== 'string' || !path.startsWith('/')) {
        throw new Error('Invalid path');
    }

    try {
        const response = await fetch("https://api.statbotics.io/v3" + path, {
            method: 'GET', // or 'POST', 'PUT', etc.
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}