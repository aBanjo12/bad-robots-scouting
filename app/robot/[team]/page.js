import { makeRequest } from '../../../utils/blue-api-helper';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';

export default async function Page({ params }) {
    const team = (await params).team;
    const data = await makeRequest("/team/" + team);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>{data.nickname} ({data.team_number})</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>School Name:</strong> {data.school_name}</p>
                    <p><strong>City:</strong> {data.city}</p>
                    <p><strong>State/Province:</strong> {data.state_prov}</p>
                    <p><strong>Country:</strong> {data.country}</p>
                    <p><strong>Address:</strong> {data.address}</p>
                    <p><strong>Postal Code:</strong> {data.postal_code}</p>
                    <p><strong>Location Name:</strong> {data.location_name}</p>
                    <p><strong>Website:</strong> <a href={data.website} target="_blank" rel="noopener noreferrer">{data.website}</a></p>
                    <p><strong>Rookie Year:</strong> {data.rookie_year}</p>
                </CardContent>
                <CardFooter>
                    <a href={data.gmaps_url} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
                </CardFooter>
            </Card>
        </div>
    );
}