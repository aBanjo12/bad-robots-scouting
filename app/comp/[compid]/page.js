"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {fetchDataFromServer, makeRequest} from '@/utils/blue-api-helper';
import styles from './page.module.css';

export default function Page({ params }) {
    const [teamsData, setTeamsData] = useState([]);
    const [matchesData, setMatchesData] = useState([]);
    const [competitionId, setCompetitionId] = useState('');

    useEffect(() => {
        async function unwrapParams() {
            const unwrappedParams = await params;
            setCompetitionId(unwrappedParams.compid);
        }

        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!competitionId) return;

        async function fetchData() {
            const cachedMatches = localStorage.getItem(`matches_${competitionId}`);
            if (cachedMatches) {
                setMatchesData(JSON.parse(cachedMatches));
                return;
            }

            try {
                const teamsResponse = await fetchDataFromServer(`/event/${competitionId}/teams`);
                setTeamsData(teamsResponse);

                const matchesResponse = await fetchDataFromServer(`/event/${competitionId}/matches`);
                const sortedMatches = matchesResponse.sort((a, b) => a.match_number - b.match_number);
                setMatchesData(sortedMatches);
                localStorage.setItem(`matches_${competitionId}`, JSON.stringify(sortedMatches));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [competitionId]);

    return (
        <div className="container mx-auto p-4">
            <div>
                <h2 className="text-xl font-bold">Matches in Competition {competitionId}</h2>
                <table className={styles.customTable}>
                    <thead>
                    <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Number</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Red Alliance</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blue Alliance</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {matchesData.map(match => {
                        const isTeam1014Playing = match.alliances.red.team_keys.includes('frc1014') || match.alliances.blue.team_keys.includes('frc1014');
                        return (
                            <tr key={match.key} className={isTeam1014Playing ? styles.highlight : ''}>
                                <td className="px-2 py-1 whitespace-nowrap">
                                    {match.match_number} ({match.key})
                                </td>
                                <td className="px-2 py-1 whitespace-nowrap">
                                    {match.alliances.red.team_keys.map(team => (
                                        <Link key={team} className = {"text-blue-500 underline"} href={`/comp/${competitionId}/team/${team.substring(3)}`}>
                                            {team.substring(3)}
                                        </Link>
                                    )).reduce((prev, curr) => [prev, ', ', curr])}
                                </td>
                                <td className="px-2 py-1 whitespace-nowrap">
                                    {match.alliances.blue.team_keys.map(team => (
                                        <Link key={team} className = {"text-blue-500 underline"} href={`/comp/${competitionId}/team/${team.substring(3)}`}>
                                            {team.substring(3)}
                                        </Link>
                                    )).reduce((prev, curr) => [prev, ', ', curr])}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}