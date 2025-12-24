// components/MatchList.tsx
import React, { useEffect } from 'react';
import { useMatchStore } from '@/store/useMatchStore';

// --- Data Types from API (Kept for component props) ---
interface ContentItem {
    playlist_title: string;
    content_id: string;
    content_title: string;
    home_team: string;
    away_team: string;
    home_team_icon: string; // Flag URL for home team
    away_team_icon: string; // Flag URL for away team
    match_date: string; 
    match_time: string; 
    match_status: 'live' | 'upcoming' | 'completed' | string;
    match_result: string | null;
    home_team_score: string | null;
    away_team_score: string | null;
    innings: string | null; 
}

interface TeamData { 
    name: string; 
    flag: string; 
    score: string; 
    overs?: string 
}
// Renaming LiveMatchCardProps for reuse
interface MatchCardProps { 
    series: string;
    innings: string;
    team1: TeamData;
    team2: TeamData;
    matchStatus: 'live' | 'upcoming' | 'completed' | string; // Use matchStatus instead of isLive
    matchResult: string | null; // Pass result
}

interface UpcomingMatchBlockProps {
    series: string;
    date: string;
    team1: { name: string; flag: string };
    team2: { name: string; flag: string };
    time: string;
}

// --- Components (Modified LiveMatchCard) ---

const MatchCard: React.FC<MatchCardProps> = ({ series, innings, team1, team2, matchStatus, matchResult }) => {
    // Determine the status text and background color
    let statusText: string;
    let statusColor: string;
    let footerContent: React.ReactNode;
    let cardClasses: string;

    if (matchStatus === 'live') {
        statusText = "LIVE";
        statusColor = "text-green-600 font-semibold";
        cardClasses = 'border border-b-2 border-b-red-700 border-gray-200 p-3 pb-0 rounded-t-lg';
        footerContent = (
            <div className="mt-4 flex justify-center">
                <button className="flex items-center px-4 py-1.5 bg-red-600 text-white font-medium text-sm rounded-t-lg shadow-lg hover:bg-red-700 transition duration-150">
                    {/* Play icon */}
                    <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Live
                </button>
            </div>
        );
    } else if (matchStatus === 'completed') {
        statusText = "COMPLETED";
        statusColor = "text-blue-600 font-semibold";
        cardClasses = 'border border-b-2 border-b-blue-700 border-gray-200 p-3 pb-0 rounded-t-lg';
        footerContent = (
            <div className="mt-4 flex justify-center py-2">
                <p className="text-sm font-medium text-gray-700 text-center px-2">
                    {matchResult || "Match Result Not Available"}
                </p>
            </div>
        );
    } else {
        // Should not happen if data is filtered correctly, but as a fallback
        return null;
    }
    
    // Helper to handle broken image links gracefully
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://flagcdn.com/w20/cricket.png'; // Fallback flag
    };

    return (
        <div className="p-2 pt-2">
            <div className={cardClasses}>
                <div className="flex justify-between items-center text-xs mb-3">
                    <span className="text-gray-600 font-medium">{series}</span>
                    <span className={statusColor}>{statusText}</span>
                </div>

                {/* Team 1 Score Row (Home Team) */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <img src={team1.flag} alt={`${team1.name} Flag`} className="w-5 h-5 mr-2 rounded-full shadow-sm" onError={handleImageError} />
                        <span className="text-sm text-gray-800">{team1.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{team1.score}</span>
                </div>

                {/* Team 2 Score Row (Away Team) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={team2.flag} alt={`${team2.name} Flag`} className="w-5 h-5 mr-2 rounded-full shadow-sm" onError={handleImageError} />
                        <span className="text-sm text-gray-800">{team2.name}</span>
                    </div>
                    {/* Score and Overs on the right side */}
                    <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 leading-none">{team2.score}</div>
                        {team2.overs && team2.overs !== 'N/A' && (
                            <div className="text-xs text-gray-500 leading-none mt-0.5">{team2.overs}</div>
                        )}
                    </div>
                </div>

                {/* Footer Content (Watch Live or Result) */}
                {footerContent}
            </div>
        </div>
    );
};

const UpcomingMatchBlock: React.FC<UpcomingMatchBlockProps> = ({ series, date, team1, team2, time }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://flagcdn.com/w20/cricket.png';
    };

    return (
        <div className="w-1/2 p-3">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-600 font-medium">{series}</span>
                <span className="text-gray-600 font-medium">{date}</span>
            </div>

            {/* Team 1 Row */}
            <div className="flex items-center mb-1">
                <img src={team1.flag} alt={`${team1.name} Flag`} className="w-4 h-4 mr-2 rounded-full shadow-sm" onError={handleImageError} />
                <span className="text-sm text-gray-800">{team1.name}</span>
            </div>

            {/* Team 2 Row */}
            <div className="flex items-center mb-2">
                <img src={team2.flag} alt={`${team2.name} Flag`} className="w-4 h-4 mr-2 rounded-full shadow-sm" onError={handleImageError} />
                <span className="text-sm text-gray-800">{team2.name}</span>
            </div>

            {/* Start Time */}
            <div className="text-xs text-red-600 font-medium mt-1">
                Starts at {time}
            </div>
        </div>
    );
}

// --- Main Component ---

export default function MatchList() {
    const { matchData, loading, error, fetchMatchData } = useMatchStore();

    useEffect(() => {
        fetchMatchData(false);
        const intervalId = setInterval(() => fetchMatchData(true), 15000); 
        return () => clearInterval(intervalId);
    }, [fetchMatchData]); 

    // --- Loading and Error States ---
    if (loading) {
        return (
            <section className="mt-4 px-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center text-gray-600">
                    Loading match data...
                </div>
            </section>
        );
    }

    if (error || !matchData) {
        return (
            <section className="mt-4 px-4">
                <div className="text-center text-red-600">
                    {/* Display error if needed */}
                </div>
            </section>
        );
    }
    
    // --- Data Preparation (No Change) ---
    const matchStatus = matchData.match_status;
    const seriesTitle = matchData.playlist_title || matchData.content_title;

    const team1Data: TeamData = {
        name: matchData.home_team,
        flag: matchData.home_team_icon,
        score: matchData.home_team_score || "0/0",
    };

    const team2Data: TeamData = {
        name: matchData.away_team,
        flag: matchData.away_team_icon,
        score: matchData.away_team_score || "0/0",
        overs: matchData.innings || "N/A" 
    };
    
    const upcomingData = {
        series: seriesTitle,
        date: matchData.match_date,
        time: matchData.match_time,
    };
    // ------------------------------------

    // --- Conditional Content Rendering ---
    let mainContent;

    if (matchStatus === 'live' || matchStatus === 'completed') {
        // Show one Live/Completed match card
        mainContent = (
            <MatchCard
                series={seriesTitle}
                innings={team2Data.overs || "N/A"}
                team1={team1Data}
                team2={team2Data}
                matchStatus={matchStatus}
                matchResult={matchData.match_result}
            />
        );
    } else if (matchStatus === 'upcoming') {
        // Show two Upcoming match blocks side-by-side
        mainContent = (
            <div className="flex border border-gray-200 m-2 rounded-lg">
                <UpcomingMatchBlock
                    {...upcomingData}
                    team1={{ name: team1Data.name, flag: team1Data.flag }}
                    team2={{ name: team2Data.name, flag: team2Data.flag }}
                />
                {/* Vertical Separator line in the middle */}
                <div className="w-px bg-gray-200 my-2"></div>
                <UpcomingMatchBlock
                    {...upcomingData}
                    team1={{ name: team1Data.name, flag: team1Data.flag }}
                    team2={{ name: team2Data.name, flag: team2Data.flag }}
                />
            </div>
        );
    } else {
        // Fallback for other statuses
        return (
            <section className="mt-4 px-4">
                <div className="text-center text-gray-500">
                    Match data is available, but the status ({matchStatus}) is not supported for display.
                </div>
            </section>
        );
    }

    // --- Final Render ---
    return (
        <section className="mt-4 px-4">
            {/* Outer Container */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">

                {/* Match Header Section */}
                <div className="flex items-center justify-between p-3 pb-2 bg-[#464646]">
                    <h2 className="text-sm font-semibold text-white">
                        {matchData.content_title}
                    </h2>
                    <span className="text-sm font-medium text-white">
                        {matchData.match_date}
                    </span>
                </div>

                {/* Conditional Main Content */}
                {mainContent}

                {/* Down Arrow/Footer element (Only showing if it's not the Upcoming view, or keep it for all) */}
                {(matchStatus === 'live' || matchStatus === 'completed') && (
                    <div className="flex justify-center p-1">
                        {/* Chevron Down Icon */}
                        <svg className="w-5 h-5 text-gray-500" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}
            </div>
        </section>
    );
}