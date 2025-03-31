"use server"

// export async function makeRequest(path) {
//     if (typeof path !== 'string' || !path.startsWith('/')) {
//         throw new Error('Invalid path');
//     }
//
//     console.log(process.env.BLUE_API_KEY)
//
//     try {
//         const response = await fetch("https://thebluealliance.com/api/v3" + path, {
//             method: 'GET', // or 'POST', 'PUT', etc.
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-TBA-Auth-Key': `${process.env.BLUE_API_KEY}`
//             }
//         });
//
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Fetch error:', error);
//         throw error;
//     }
// }

export async function fetchDataFromServer(path) {
    try {
        const response = await fetch("https://www.thebluealliance.com/api/v3" + path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-TBA-Auth-Key': `${process.env.BLUE_API_KEY}`
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

export async function fetchAndCacheData(path) {
    const cachedData = localStorage.getItem(path);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await fetchDataFromServer(path);
    localStorage.setItem(path, JSON.stringify(data));
    return data;
}