import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { path } = req.query;

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-TBA-Auth-Key': process.env.BLUE_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}