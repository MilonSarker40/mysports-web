// components/MatchList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

// --- Data Types from API ---
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

interface LiveScoreResponse {
    content_id: string;
    home_team_score: string;
    away_team_score: string;
    match_status: 'live' | 'upcoming' | 'completed' | string;
    playlist_type: string;
}

interface AllContentResponse {
    items: {
        playlist_title: string;
        playlist_type: string;
        contents: ContentItem[];
    }[];
}

interface TeamData { 
    name: string; 
    flag: string; 
    score: string; 
    overs?: string 
}

interface LiveMatchCardProps {
    series: string;
    innings: string;
    team1: TeamData;
    team2: TeamData;
    isLive: boolean; 
}

interface UpcomingMatchBlockProps {
    series: string;
    date: string;
    team1: { name: string; flag: string };
    team2: { name: string; flag: string };
    time: string;
}

// --- Components (Same UI Structure) ---

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ series, innings, team1, team2, isLive }) => {
    if (!isLive) return null; 

    // Helper to handle broken image links gracefully
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://flagcdn.com/w20/cricket.png'; // Fallback flag
    };

    return (
        <div className="p-2 pt-2">
            <div className='border border-b-2 border-b-red-700 border-gray-200 p-3 pb-0 rounded-t-lg'>
                <div className="flex justify-between items-center text-xs mb-3">
                    <span className="text-gray-600 font-medium">{series}</span>
                    <span className="text-green-600 font-semibold">{innings}</span>
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
    const [matchData, setMatchData] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch live score data
            const liveScoreResponse = await api.get<LiveScoreResponse>('/contentinfo/live-score');
            const liveScore = liveScoreResponse.data;
            const targetContentId = liveScore.content_id;

            if (liveScore.match_status !== 'live') {

            }
            
            // 2. Fetch all content data to get details (teams, flags, series info)
            const allContentResponse = await api.post<AllContentResponse>('/contentinfo/all');
            const allContent = allContentResponse.data;
            
            let matchedContent: ContentItem | null = null;
            let playlistTitle: string | null = null;

            // Find the match details using the content_id from the live score response
            for (const playlist of allContent.items) {
                const content = playlist.contents.find(c => c.content_id === targetContentId);
                if (content) {
                    matchedContent = content;
                    playlistTitle = playlist.playlist_title;
                    break;
                }
            }

            if (matchedContent) {
                setMatchData({
                    ...matchedContent,
                    playlist_title: playlistTitle || matchedContent.content_title, // Use playlist title as series name
                    // Override score and status with the most up-to-date live data
                    home_team_score: liveScore.home_team_score,
                    away_team_score: liveScore.away_team_score,
                    match_status: liveScore.match_status,
                });
            } else {
                 setError("Live match details not found in content list.");
            }

        } catch (e) {
            console.error("Error fetching match data:", e);
            setError("Failed to load match data from API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMatchData();
        // Set up a polling interval to fetch data frequently (e.g., every 15 seconds)
        const intervalId = setInterval(fetchMatchData, 15000); 

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [fetchMatchData]);

    // --- Loading and Error States ---
    if (loading) {
        return (
            <section className="mt-4 px-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center text-gray-600">
                    Loading live match data...
                </div>
            </section>
        );
    }

    if (error || !matchData) {
        return (
            <section className="mt-4 px-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center text-red-600">
                    {error || "No match data available to display."}
                </div>
            </section>
        );
    }
    
    // --- Prepare data for components ---
    
    const isLive = matchData.match_status === 'live';
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
        overs: "N/A" // Overs are not in the provided live-score structure
    };
    
    // Placeholder for upcoming data based on the current series
    const upcomingData = {
        series: seriesTitle,
        date: "Next Match TBD",
        time: "TBD",
    };

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

                {/* Live Match Cards (Conditionally rendered) */}
                {isLive ? (
                    <>
                        <LiveMatchCard
                            series={seriesTitle}
                            innings={"LIVE"} // Use a clear live indicator
                            team1={team1Data}
                            team2={team2Data}
                            isLive={isLive}
                        />
                         {/* Duplicating the live card as per the original image structure */}
                         <LiveMatchCard
                            series={seriesTitle}
                            innings={"LIVE"}
                            team1={team1Data}
                            team2={team2Data}
                            isLive={isLive}
                        />
                    </>
                ) : (
                    // Show result/status if not live
                    <div className="p-3 text-center text-gray-700 bg-gray-50 border-b">
                        <p className="font-semibold text-sm">Match Status: {matchData.match_result || matchData.match_status}</p>
                    </div>
                )}
                
                {/* Upcoming Matches Section (Side-by-side) */}
                <div className="flex border border-gray-200 m-2 rounded-lg">
                    {/* Upcoming Match 1 */}
                    <UpcomingMatchBlock
                        {...upcomingData}
                        team1={{ name: team1Data.name, flag: team1Data.flag }}
                        team2={{ name: team2Data.name, flag: team2Data.flag }}
                    />
                    {/* Vertical Separator line in the middle */}
                    <div className="w-px bg-gray-200 my-2"></div>
                    {/* Upcoming Match 2 */}
                    <UpcomingMatchBlock
                        {...upcomingData}
                        team1={{ name: team1Data.name, flag: team1Data.flag }}
                        team2={{ name: team2Data.name, flag: team2Data.flag }}
                    />
                </div>

                {/* Down Arrow/Footer element */}
                <div className="flex justify-center p-1">
                    {/* Chevron Down Icon */}
                    <svg className="w-5 h-5 text-gray-500" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </section>
    );
}