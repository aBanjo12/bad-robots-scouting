import { makeRequest } from '../../utils/blue-api-helper';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import Link from 'next/link';

export default async function Page({ params }) {
    const matchKey = (await params).match;
    const data = await makeRequest("/match/" + matchKey);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Match {data.match_number} - {data.comp_level.toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <h2>Alliances</h2>
                    <div className="flex justify-between">
                        <div>
                            <h3>Red Alliance</h3>
                            <p><strong>Score:</strong> {data.alliances.red.score}</p>
                            <p><strong>Teams:</strong> {data.alliances.red.team_keys.map(team => (
                                <Link key={team} href={`/robot/${team}`}>
                                    {team}
                                </Link>
                            )).reduce((prev, curr) => [prev, ', ', curr])}</p>
                        </div>
                        <div>
                            <h3>Blue Alliance</h3>
                            <p><strong>Score:</strong> {data.alliances.blue.score}</p>
                            <p><strong>Teams:</strong> {data.alliances.blue.team_keys.map(team => (
                                <Link key={team} href={`/robot/${team}`}>
                                    {team}
                                </Link>
                            )).reduce((prev, curr) => [prev, ', ', curr])}</p>
                        </div>
                    </div>
                    <h2>Score Breakdown</h2>
                    <div className="flex justify-between">
                        <div>
                            <h3>Red Alliance</h3>
                            <p><strong>Auto Points:</strong> {data.score_breakdown.red.auto_points}</p>
                            <p><strong>Teleop Points:</strong> {data.score_breakdown.red.teleop_points}</p>
                            <p><strong>Total Points:</strong> {data.score_breakdown.red.total_points}</p>
                        </div>
                        <div>
                            <h3>Blue Alliance</h3>
                            <p><strong>Auto Points:</strong> {data.score_breakdown.blue.auto_points}</p>
                            <p><strong>Teleop Points:</strong> {data.score_breakdown.blue.teleop_points}</p>
                            <p><strong>Total Points:</strong> {data.score_breakdown.blue.total_points}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <p><strong>Winning Alliance:</strong> {data.winning_alliance}</p>
                </CardFooter>
            </Card>
        </div>
    );
}