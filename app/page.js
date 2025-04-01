"use client"

import React, { useEffect, useState } from 'react';
import { makeRequest } from '@/utils/blue-api-helper';
import { makeRequest as makeStatboticsRequest } from '@/utils/statbotics-api-helper';
import Link from 'next/link';
import styles from './page.module.css';
import {getComp} from "@/utils/comp-state";

export default function Home() {
  const [teams, setTeams] = useState([]);
  const competitionId = getComp();

  useEffect(() => {
    console.log('useEffect triggered');
    async function fetchTeams() {
      const cachedTeams = localStorage.getItem('teamsWithEpa');
      if (cachedTeams) {
        setTeams(JSON.parse(cachedTeams));
        return;
      }

      try {
        console.log(`/event/${competitionId}/teams`);
        const teamsData = await makeRequest(`/event/${competitionId}/teams`);
        console.log('Teams data:', teamsData);
        const teamsWithEpa = await Promise.all(teamsData.map(async (team) => {
          try {
            console.log(`/team_year/${team.team_number}/2025`);
            const teamYearData = await makeStatboticsRequest(`/team_year/${team.team_number}/2025`);
            console.log(`Team Year data for team ${team.team_number}:`, teamYearData);
            return { ...team, team_year: teamYearData };
          } catch (error) {
            console.error(`Error fetching Team Year data for team ${team.team_number}:`, error);
            return { ...team, team_year: null };
          }
        }));
        teamsWithEpa.sort((a, b) => b.team_year.epa.breakdown.total_points - a.team_year.epa.breakdown.total_points);
        setTeams(teamsWithEpa);
        localStorage.setItem('teamsWithEpa', JSON.stringify(teamsWithEpa));
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    }

    fetchTeams();
  }, []);

  return (
      <div className="container mx-auto p-4 mt-0">
        <Link href={`/comp/${competitionId}`}>Match list</Link>
        <h1 className="text-3xl font-bold mb-4">Teams in Competition {competitionId}</h1>
        <table className={styles.customTable}>
          <thead>
          <tr>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Number</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EPA</th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {teams.map((team, index) => (
              <tr key={team.team_number}>
                <td className="px-2 py-1 whitespace-nowrap">{index + 1}</td>
                <td className="px-2 py-1 whitespace-nowrap"><Link href={`comp/${competitionId}/team/${team.team_number}`}>{team.team_number}</Link></td>
                <td className="px-2 py-1 whitespace-nowrap">{team.nickname}</td>
                <td className="px-2 py-1 whitespace-nowrap">{team.city}, {team.state_prov}, {team.country}</td>
                <td className="px-2 py-1 whitespace-nowrap">{team.team_year ? team.team_year.epa.breakdown.total_points : 'N/A'}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}