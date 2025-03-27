import React, { useState, useEffect } from 'react';

export function FuzzyFindSearchBar({ competitions, onSelect }) {
    const [query, setQuery] = useState('');
    const [filteredCompetitions, setFilteredCompetitions] = useState(competitions);

    useEffect(() => {
        setFilteredCompetitions(
            competitions.filter(comp => comp.toLowerCase().includes(query.toLowerCase()))
        );
    }, [query, competitions]);

    return (
        <div className="container mx-auto p-4 mt-0">
            <input
                type="text"
                placeholder="Search competitions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border rounded-lg"
            />
            <ul className="mt-4">
                {filteredCompetitions.map((comp) => (
                    <li key={comp} onClick={() => onSelect(comp)} className="p-2 border-b cursor-pointer">
                        {comp}
                    </li>
                ))}
            </ul>
        </div>
    );
}