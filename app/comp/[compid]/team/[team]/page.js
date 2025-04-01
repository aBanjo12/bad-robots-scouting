"use client"

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from "next/link";
import { fetchAndCacheData as fetchAndCacheStatData } from '@/utils/statbotics-api-helper';
import { getCache, setCacheItem } from '@/utils/cache';

export default function TeamPage({ params }) {
    const [compid, setCompid] = useState('');
    const [team, setTeam] = useState('');
    const [epaData, setEpaData] = useState(null);
    const [allEpaValues, setAllEpaValues] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        async function unwrapParams() {
            const unwrappedParams = await params;
            setCompid(unwrappedParams.compid);
            setTeam(unwrappedParams.team);
        }

        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!compid || !team) return;

        const fetchTeamData = async () => {
            const cacheKey = `teamsWithEpa_${compid}_${team}`;
            const cachedTeamData = getCache(cacheKey);

            if (cachedTeamData) {
                setEpaData(cachedTeamData.team_year.epa);
                setAllEpaValues(cachedTeamData.allEpaValues);
                return;
            }

            try {
                const teamYearData = await fetchAndCacheStatData(`/team_year/${team.replace('frc', '')}/2025`);
                const teamsWithEpa = await Promise.all(
                    (await fetchAndCacheData(`/event/${compid}/teams`)).map(async (team) => {
                        const teamYearData = await fetchAndCacheStatData(`/team_year/${team.team_number}/2025`);
                        return { ...team, team_year: teamYearData };
                    })
                );                const teamData = teamsWithEpa.find(t => t.team_number === parseInt(team.replace('frc', '')));

                if (teamData) {
                    setEpaData(teamYearData.epa);
                    const epaValuesByCategory = {};
                    teamsWithEpa.forEach(t => {
                        Object.entries(t.team_year.epa.breakdown).forEach(([key, value]) => {
                            if (!epaValuesByCategory[key]) {
                                epaValuesByCategory[key] = [];
                            }
                            epaValuesByCategory[key].push(value);
                        });
                    });
                    setAllEpaValues(epaValuesByCategory);
                    setCacheItem(cacheKey, { team_year: teamYearData, allEpaValues: epaValuesByCategory });
                } else {
                    setError('Team data not found');
                }
            } catch (error) {
                console.error('Error fetching team data:', error);
                setError('Network request error');
            }
        };

        fetchTeamData();
    }, [compid, team]);

    if (error) {
        return <div>{error}. Please visit <Link className={"text-blue-600 underline"} href={'/'}>home</Link></div>;
    }

    if (epaData === null || Object.keys(allEpaValues).length === 0) {
        return <div>Team not found, or you have not fetched the teams yet. Please visit <Link className={"text-blue-600 underline"} href={'/'}>home</Link></div>;
    }

    const interpolateColor = (value, min, max) => {
        const ratio = (value - min) / (max - min);
        const red = Math.round(255 * (1 - ratio));
        const green = Math.round(255 * ratio);
        return `rgb(${red}, ${green}, 0)`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Team {team}</h1>
            <table className={`min-w-full divide-y divide-gray-200 ${styles.customTable}`}>
                <thead>
                <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(epaData.breakdown).map(([key, value]) => {
                    const minEpa = Math.min(...allEpaValues[key]);
                    const maxEpa = Math.max(...allEpaValues[key]);
                    return (
                        <tr key={key} style={{ backgroundColor: interpolateColor(value, minEpa, maxEpa) }}>
                            <td className="px-2 py-1 whitespace-nowrap">{key}</td>
                            <td className="px-2 py-1 whitespace-nowrap">{value !== null ? value : 'N/A'}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}