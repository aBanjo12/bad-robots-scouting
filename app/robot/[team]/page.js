import { makeRequest as makeBlueRequest } from '../../../utils/blue-api-helper';
import { makeRequest as makeStatboticsRequest } from '../../../utils/statbotics-api-helper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function Page({ params }) {
    const team = (await params).team;
    const teamNumber = team.replace('frc', '');

    const competitionId = "2024ohmv";
    const year = competitionId.substring(0, 4);

    try {
        const [data, epaData, competitionTeams] = await Promise.all([
            makeBlueRequest("/team/" + team),
            makeStatboticsRequest("/team_year/" + teamNumber + "/" + year),
            makeBlueRequest("/event/" + competitionId + "/teams")
        ]);

        const competitionEpaData = await Promise.all(
            competitionTeams.map(async (team) => {
                const teamNum = team.team_number;
                const epa = await makeStatboticsRequest("/team_year/" + teamNum + "/" + year);
                return { team: teamNum, epa: epa.epa_total };
            })
        );

        const epaValues = competitionEpaData.map(team => team.epa).filter(epa => epa !== null);
        const minEpa = Math.min(...epaValues);
        const maxEpa = Math.max(...epaValues);

        const interpolateColor = (value, min, max) => {
            const ratio = (value - min) / (max - min);
            const red = Math.round(255 * (1 - ratio));
            const green = Math.round(255 * ratio);
            return `rgb(${red}, ${green}, 0)`;
        };

        return (
            <div className="container mx-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{data.nickname} ({data.team_number})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table>
                            <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {epaData.epa.breakdown && Object.keys(epaData.epa.breakdown).map((key) => (
                                <tr key={key} style={{ backgroundColor: interpolateColor(epaData.epa.breakdown[key] || 255, 255, 255) }}>
                                    <td className="px-6 py-4 whitespace-nowrap">{key}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{epaData.epa.breakdown[key]?.toFixed(2) || 'N/A'}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">Rank</td>
                                <td className="px-6 py-4 whitespace-nowrap">{epaData.rank || 'N/A'}</td>
                            </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Error fetching data</div>;
    }
}