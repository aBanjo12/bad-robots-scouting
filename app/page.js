"use client"

import React, { useEffect, useState } from 'react';
import { fetchAndCacheData } from '@/utils/blue-api-helper';
import { fetchAndCacheData as fetchAndCacheStatData } from '@/utils/statbotics-api-helper'; // Import useSetupCache
import Link from 'next/link';
import { useCacheContext } from '@/components/CacheProvider';
import styles from './page.module.css';

export default function Home() {
  const [teams, setTeams] = useState([]);
  const competitionId = "2025ohmv";
  const { getCache, setCacheItem } = useCacheContext();

  // Call useSetupCache directly in the component body (valid use of hooks)

  useEffect(() => {
    const fetchTeams = async () => {
      const cachedTeams = getCache('teamsWithEpa');
      if (cachedTeams) {
        setTeams(cachedTeams);
        return;
      }

      try {
        const teamsData = await fetchAndCacheData(`/event/${competitionId}/teams`);
        const teamsWithEpa = await Promise.all(teamsData.map(async (team) => {
          try {
            const teamYearData = await fetchAndCacheStatData(`/team_year/${team.team_number}/2025`);
            return { ...team, team_year: teamYearData };
          } catch (error) {
            return { ...team, team_year: null };
          }
        }));

        teamsWithEpa.sort((a, b) => b.team_year.epa.breakdown.total_points - a.team_year.epa.breakdown.total_points);
        setTeams(teamsWithEpa);
        setCacheItem('teamsWithEpa', teamsWithEpa); // Save teams data to cache after data is fetched
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [competitionId, getCache, setCacheItem]);

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
                <td className="px-2 py-1 whitespace-nowrap">
                  <Link className={"text-blue-500 underline"} href={`comp/${competitionId}/team/${team.team_number}`}>
                    {team.team_number}
                  </Link>
                </td>
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
