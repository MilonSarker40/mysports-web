// components/FootballMatch.jsx
import React from 'react';

// --- Logo URLs (Example placeholders) ---
const BARCELONA_LOGO_URL = "https://flagcdn.com/w20/bd.png"; 
const REAL_MADRID_LOGO_URL = "https://flagcdn.com/w20/za.png"; 
const ATHLETIC_CLUB_LOGO_URL = "https://flagcdn.com/w20/bd.png"; 
const ESPANYOL_LOGO_URL = "https://flagcdn.com/w20/za.png"; 
const REAL_BETIS_LOGO_URL = "https://flagcdn.com/w20/bd.png"; 
const ATLETICO_MADRID_LOGO_URL = "https://flagcdn.com/w20/za.png"; 


// --- Sub-Components ---

// Component for the Live Match Card Section (Top Part)
const LiveMatchCard = ({ label, team1, team2 }) => (
  <div className="border border-b-2 border-b-red-700 border-gray-200 m-2 p-3 pb-0 rounded-t-lg">
    {/* Match Label (e.g., Semifinal) */}
    <div className="text-xs mb-3 text-gray-600 font-medium">
      {label}
    </div>

    {/* Team 1 Row */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <img src={team1.logo} alt={`${team1.name} Logo`} className="w-5 h-5 mr-2 rounded-full shadow-sm border border-gray-100" /> 
        <span className="text-sm text-gray-800">{team1.name}</span>
      </div>
      <span className="text-base font-semibold text-gray-900">{team1.score}</span>
    </div>

    {/* Team 2 Row */}
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img src={team2.logo} alt={`${team2.name} Logo`} className="w-5 h-5 mr-2 rounded-full shadow-sm border border-gray-100" />
        <span className="text-sm text-gray-800">{team2.name}</span>
      </div>
      <span className="text-base font-semibold text-gray-900">{team2.score}</span>
    </div>
    
    {/* Watch Live Button */}
    <div className="mt-4 flex justify-center">
      <button className="flex items-center px-4 py-1.5 bg-red-600 text-white font-medium text-sm rounded-t-lg shadow-lg hover:bg-red-700 transition duration-150">
        {/* Play icon */}
        <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5v14l11-7z" />
        </svg>
        Watch Live
      </button>
    </div>
  </div>
);

// Component for a single Upcoming Match Block (side-by-side layout)
const UpcomingMatchBlock = ({ label, date, team1, team2, time }) => (
    <div className="w-1/2 p-3">
        <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-600 font-medium">{label}</span> 
            <span className="text-gray-600 font-medium">{date}</span>
        </div>
        
        {/* Team 1 Row */}
        <div className="flex items-center mb-1">
            <img src={team1.logo} alt={`${team1.name} Logo`} className="w-4 h-4 mr-2 rounded-full shadow-sm border border-gray-100" />
            <span className="text-sm text-gray-800">{team1.name}</span>
        </div>

        {/* Team 2 Row */}
        <div className="flex items-center mb-2">
            <img src={team2.logo} alt={`${team2.name} Logo`} className="w-4 h-4 mr-2 rounded-full shadow-sm border border-gray-100" />
            <span className="text-sm text-gray-800">{team2.name}</span>
        </div>

        {/* Start Time */}
        <div className="text-xs text-red-600 font-medium mt-1">
            Starts at {time}
        </div>
    </div>
);


// --- Main Component: FootballMatch ---

export default function FootballMatch({ data }) {
    
    // Default data structure mirroring the image content
    const defaultData = {
        title: "La Liga 21-22",
        dateRange: "Sep - Dec",
        liveMatch: {
            label: "Semifinal",
            team1: { name: "Barcelona", logo: BARCELONA_LOGO_URL, score: "2" },
            team2: { name: "Real Madrid", logo: REAL_MADRID_LOGO_URL, score: "0" },
        },
        upcomingMatches: [
            {
                label: "Match Day 24",
                date: "Fri Jul 7",
                time: "3:00 pm",
                team1: { name: "Athletic Club", logo: ATHLETIC_CLUB_LOGO_URL },
                team2: { name: "Espanyol", logo: ESPANYOL_LOGO_URL },
            },
            {
                label: "Final",
                date: "Fri Jul 7",
                time: "3:00 pm",
                team1: { name: "Real Betis", logo: REAL_BETIS_LOGO_URL },
                team2: { name: "Athletico Madrid", logo: ATLETICO_MADRID_LOGO_URL },
            }
        ]
    };

    const { title, dateRange, liveMatch, upcomingMatches } = data || defaultData;
    
    return (
        <section className="mt-4 px-4">
            {/* Outer Container for the single match card UI */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                
                {/* Match Header Section (Dark Background as per image) */}
                <div className="flex items-center justify-between p-3 pb-2 bg-[#464646]">
                    <h2 className="text-sm font-semibold text-white">
                        {title}
                    </h2>
                    <span className="text-sm font-medium text-white">
                        {dateRange}
                    </span>
                </div>
                
                {/* Live Match Card */}
                <LiveMatchCard 
                    label={liveMatch.label}
                    team1={liveMatch.team1}
                    team2={liveMatch.team2}
                />

                {/* Upcoming Matches Section (Side-by-side) */}
                <div className="flex m-2 rounded-lg border border-gray-200">
                    {/* Map the two upcoming matches */}
                    {upcomingMatches.slice(0, 2).map((match, index) => (
                        <React.Fragment key={index}>
                            {/* Vertical Separator line ONLY between the first and second blocks */}
                            {index === 1 && <div className="w-px bg-gray-200 my-2"></div>}
                            
                            <UpcomingMatchBlock 
                                label={match.label} 
                                date={match.date} 
                                time={match.time}
                                team1={match.team1}
                                team2={match.team2}
                            />
                        </React.Fragment>
                    ))}
                </div>
                
                {/* Down Arrow/Footer element */}
                <div className="flex justify-center p-1">
                    {/* Chevron Down Icon */}
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                
            </div>
        </section>
    );
}