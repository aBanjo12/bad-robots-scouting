"use client"

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function TeamPage({ params }) {
    const [compid, setCompid] = useState('');
    const [team, setTeam] = useState('');
    const [epaData, setEpaData] = useState(null);
    const [allEpaValues, setAllEpaValues] = useState({});

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

        const cachedTeamsWithEpa = localStorage.getItem('teamsWithEpa');
        if (cachedTeamsWithEpa) {
            const teamsWithEpa = JSON.parse(cachedTeamsWithEpa);
            const teamData = teamsWithEpa.find(t => t.team_number === parseInt(team.replace('frc', '')));
            if (teamData) {
                setEpaData(teamData.team_year.epa);
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
            }
        }
    }, [compid, team]);

    useEffect(() => {
        console.log('epaData:', epaData);
        console.log('allEpaValues:', allEpaValues);
    }, [epaData, allEpaValues]);

    if (epaData === null || Object.keys(allEpaValues).length === 0) {
        return <div>Please visit the home page to obtain the necessary cache before accessing this page.</div>;
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