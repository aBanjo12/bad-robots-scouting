// pages/api/competitions.js
import { fetchDataFromServer } from '@/utils/blue-api-helper';

export default async function handler(req, res) {
    try {
        const competitionIds = await fetchDataFromServer('/events/2025/keys');
        res.status(200).json(competitionIds);
    } catch (error) {
        console.error('Error fetching competition IDs:', error);
        res.status(500).json({ error: 'Failed to fetch competition IDs' });
    }
}