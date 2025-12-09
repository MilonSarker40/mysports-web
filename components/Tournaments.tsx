// components/Tournaments.tsx
import React from 'react';

// Flags (reused from previous design)
const BANGLADESH_FLAG_URL = "https://flagcdn.com/w20/bd.png";
const SOUTH_AFRICA_FLAG_URL = "https://flagcdn.com/w20/za.png";


// --- Sub-Components ---

// Component for the Live Match Card Section (Top Part)
const LiveMatchCard = ({ series, innings, team1, team2 }) => (
  <div className="border border-b-2 border-b-red-700 border-gray-200 m-2 p-3 pb-0 rounded-t-lg">
    <div className="flex justify-between items-center text-xs mb-3">
      <span className="text-gray-600 font-medium">{series}</span>
      {/* Green text for innings status */}
      <span className="text-green-600 font-semibold">{innings}</span> 
    </div>

    {/* Team 1 Score Row (Bangladesh) */}
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <img src={team1.flag} alt={`${team1.name} Flag`} className="w-5 h-5 mr-2 rounded-full shadow-sm" />
        <span className="text-sm text-gray-800">{team1.name}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{team1.score}</span>
    </div>

    {/* Team 2 Score Row (South Africa) */}
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img src={team2.flag} alt={`${team2.name} Flag`} className="w-5 h-5 mr-2 rounded-full shadow-sm" />
        <span className="text-sm text-gray-800">{team2.name}</span>
      </div>
      {/* Score and Overs on the right side */}
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-900 leading-none">{team2.score}</div>
        <div className="text-xs text-gray-500 leading-none mt-0.5">{team2.overs}</div>
      </div>
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
const UpcomingMatchBlock = ({ series, date, team1, team2, time }) => (
    <div className="w-1/2 p-3">
        <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-600 font-medium">{series}</span>
            <span className="text-gray-600 font-medium">{date}</span>
        </div>
        
        {/* Team 1 Row */}
        <div className="flex items-center mb-1">
            <img src={team1.flag} alt={`${team1.name} Flag`} className="w-4 h-4 mr-2 rounded-full shadow-sm" />
            <span className="text-sm text-gray-800">{team1.name}</span>
        </div>

        {/* Team 2 Row */}
        <div className="flex items-center mb-2">
            <img src={team2.flag} alt={`${team2.name} Flag`} className="w-4 h-4 mr-2 rounded-full shadow-sm" />
            <span className="text-sm text-gray-800">{team2.name}</span>
        </div>

        {/* Start Time */}
        <div className="text-xs text-red-600 font-medium mt-1">
            Starts at {time}
        </div>
    </div>
);


// --- Main Refactored Component ---

// The component now accepts data as a prop for API readiness
export default function Tournaments({ data}) {
    
    // Default data structure if no props are passed, mirroring the image content
    const defaultData = {
        title: "T20 World Cup 2021",
        dateRange: "Sep 5 - 25",
        liveMatch: {
            series: "ODI 1 of 3",
            innings: "1st innings",
            team1: { name: "Bangladesh", flag: BANGLADESH_FLAG_URL, score: "320/8" },
            team2: { name: "South Africa", flag: SOUTH_AFRICA_FLAG_URL, score: "287/4", overs: "36.2 ov" },
        },
        upcomingMatches: [
            {
                series: "ODI 2 of 3",
                date: "Fri Jul 7",
                time: "3:00 pm",
                team1: { name: "Bangladesh", flag: BANGLADESH_FLAG_URL },
                team2: { name: "South Africa", flag: SOUTH_AFRICA_FLAG_URL },
            },
            {
                series: "ODI 2 of 3",
                date: "Fri Jul 7",
                time: "3:00 pm",
                team1: { name: "Bangladesh", flag: BANGLADESH_FLAG_URL },
                team2: { name: "South Africa", flag: SOUTH_AFRICA_FLAG_URL },
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
                
                {/* Live Match Card (The single large block) */}
                <LiveMatchCard 
                    series={liveMatch.series} 
                    innings={liveMatch.innings}
                    team1={liveMatch.team1}
                    team2={liveMatch.team2}
                />

                {/* Upcoming Matches Section (Side-by-side) */}
                <div className="flex border border-gray-200 m-2 rounded-lg">
                    {/* Map the two upcoming matches */}
                    {upcomingMatches.slice(0, 2).map((match, index) => (
                        <React.Fragment key={index}>
                            {/* Vertical Separator line ONLY between the first and second blocks */}
                            {index === 1 && <div className="w-px bg-gray-200 my-2"></div>}
                            
                            <UpcomingMatchBlock 
                                series={match.series} 
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