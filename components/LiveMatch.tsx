// components/MatchList.tsx
import React, { useState, useEffect } from 'react';

// Types based on your API response structure
interface MatchData {
  content_id: string;
  home_team_score: string;
  away_team_score: string;
  match_status: string;
  playlist_type: string;
}

interface PlaylistItem {
  playlist_title: string;
  playlist_type: string;
  playlist_description: string;
  contents: Array<{
    content_id: string;
    content_title: string;
    home_team: string;
    away_team: string;
    home_team_icon: string;
    away_team_icon: string;
    home_team_score: string;
    away_team_score: string;
    match_status: string;
    match_date: string;
    match_time: string;
    match_result: string;
  }>;
}

interface LiveScoreData {
  content_id: string;
  home_team_score: string;
  away_team_score: string;
  match_status: string;
  playlist_type: string;
}

// Component for a single Live Match Card
const LiveMatchCard = ({ 
  series, 
  innings, 
  team1, 
  team2, 
  status = "live" 
}: { 
  series: string; 
  innings: string; 
  team1: { name: string; flag: string; score: string; overs?: string };
  team2: { name: string; flag: string; score: string; overs?: string };
  status?: string;
}) => (
  <div className="p-2 pt-2">
    <div className='border border-b-2 border-b-red-700 border-gray-200 p-3 pb-0 rounded-t-lg'>
      <div className="flex justify-between items-center text-xs mb-3">
        <span className="text-gray-600 font-medium">{series}</span>
        {/* Live status indicator */}
        {status === "live" && (
          <div className="flex items-center">
            <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
            <span className="text-green-600 font-semibold">{innings}</span>
          </div>
        )}
        {status === "completed" && (
          <span className="text-blue-600 font-semibold">Completed</span>
        )}
      </div>

      {/* Team 1 Score Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img 
            src={team1.flag} 
            alt={`${team1.name} Flag`} 
            className="w-5 h-5 mr-2 rounded-full shadow-sm" 
            onError={(e) => {
              // Fallback for broken images
              (e.target as HTMLImageElement).src = `https://flagcdn.com/w20/${team1.name === 'Pakistan' ? 'pk' : 'gb-eng'}.png`;
            }}
          />
          <span className="text-sm text-gray-800">{team1.name}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{team1.score}</span>
      </div>

      {/* Team 2 Score Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={team2.flag} 
            alt={`${team2.name} Flag`} 
            className="w-5 h-5 mr-2 rounded-full shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://flagcdn.com/w20/${team2.name === 'Pakistan' ? 'pk' : 'gb-eng'}.png`;
            }}
          />
          <span className="text-sm text-gray-800">{team2.name}</span>
        </div>
        {/* Score and Overs on the right side */}
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900 leading-none">{team2.score}</div>
          {team2.overs && (
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

// Component for a single Upcoming Match Block
const UpcomingMatchBlock = ({ 
  series, 
  date, 
  team1, 
  team2, 
  time 
}: { 
  series: string; 
  date: string; 
  team1: { name: string; flag: string };
  team2: { name: string; flag: string };
  time: string;
}) => (
  <div className="w-1/2 p-3">
    <div className="flex justify-between text-xs mb-2">
      <span className="text-gray-600 font-medium">{series}</span>
      <span className="text-gray-600 font-medium">{date}</span>
    </div>
    
    {/* Team 1 Row */}
    <div className="flex items-center mb-1">
      <img 
        src={team1.flag} 
        alt={`${team1.name} Flag`} 
        className="w-4 h-4 mr-2 rounded-full shadow-sm"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://flagcdn.com/w20/${team1.name === 'Pakistan' ? 'pk' : 'gb-eng'}.png`;
        }}
      />
      <span className="text-sm text-gray-800">{team1.name}</span>
    </div>

    {/* Team 2 Row */}
    <div className="flex items-center mb-2">
      <img 
        src={team2.flag} 
        alt={`${team2.name} Flag`} 
        className="w-4 h-4 mr-2 rounded-full shadow-sm"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://flagcdn.com/w20/${team2.name === 'Pakistan' ? 'pk' : 'gb-eng'}.png`;
        }}
      />
      <span className="text-sm text-gray-800">{team2.name}</span>
    </div>

    {/* Start Time */}
    <div className="text-xs text-red-600 font-medium mt-1">
      Starts at {time}
    </div>
  </div>
);

// Component for Completed Match Card
const CompletedMatchCard = ({ 
  series, 
  team1, 
  team2, 
  result 
}: { 
  series: string; 
  team1: { name: string; flag: string; score: string };
  team2: { name: string; flag: string; score: string };
  result: string;
}) => (
  <div className="p-2 pt-2">
    <div className='border border-gray-200 p-3 rounded-lg'>
      <div className="flex justify-between items-center text-xs mb-3">
        <span className="text-gray-600 font-medium">{series}</span>
        <span className="text-blue-600 font-semibold">Completed</span>
      </div>

      {/* Team 1 Score Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img 
            src={team1.flag} 
            alt={`${team1.name} Flag`} 
            className="w-5 h-5 mr-2 rounded-full shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://flagcdn.com/w20/${team1.name === 'Pakistan' ? 'pk' : 'gb-eng'}.png`;
            }}
          />
          <span className="text-sm text-gray-800">{team1.name}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{team1.score}</span>
      </div>

      {/* Team 2 Score Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img 
            src={team2.flag} 
            alt={`${team2.name} Flag`} 
            className="w-5 h-5 mr-2 rounded-full shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://flagcdn.com/w20/${team2.name === 'Pakistan' ? 'pk' : 'gb-eng'}.png`;
            }}
          />
          <span className="text-sm text-gray-800">{team2.name}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{team2.score}</span>
      </div>

      {/* Match Result */}
      <div className="text-xs text-center text-gray-700 font-medium p-2 bg-gray-50 rounded">
        {result}
      </div>
    </div>
  </div>
);

export default function MatchList() {
  const [matches, setMatches] = useState<PlaylistItem[]>([]);
  const [liveScores, setLiveScores] = useState<LiveScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to parse score strings (e.g., "PAK 556 & 220" -> "556 & 220")
  const parseScore = (scoreStr: string) => {
    // Remove team code and keep only scores
    return scoreStr.replace(/^[A-Z]+\s*/, '');
  };

  // Function to get flag URL from team name
  const getFlagUrl = (teamName: string) => {
    const flags: Record<string, string> = {
      'Pakistan': 'https://flagcdn.com/w20/pk.png',
      'England': 'https://flagcdn.com/w20/gb-eng.png',
      'Bangladesh': 'https://flagcdn.com/w20/bd.png',
      'South Africa': 'https://flagcdn.com/w20/za.png'
    };
    return flags[teamName] || `https://flagcdn.com/w20/${teamName.toLowerCase().substring(0, 2)}.png`;
  };

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch playlist/match data
        const playlistResponse = await fetch('https://apiv2.mysports.com.bd/api/v1/contentinfo/all');
        if (!playlistResponse.ok) {
          throw new Error(`HTTP error! status: ${playlistResponse.status}`);
        }
        const playlistData = await playlistResponse.json();
        
        // Fetch live scores
        const liveScoreResponse = await fetch('https://apiv2.mysports.com.bd/api/v1/contentinfo/live-score');
        if (!liveScoreResponse.ok) {
          throw new Error(`HTTP error! status: ${liveScoreResponse.status}`);
        }
        const liveScoreData = await liveScoreResponse.json();

        setMatches(playlistData);
        setLiveScores(liveScoreData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
        
        // Fallback to mock data if API fails
        setMatches([
          {
            playlist_title: "England tour of Pakistan, 2024",
            playlist_type: "cricket",
            playlist_description: "England tour of Pakistan, 2024\n3 Tests . Oct 07 - Oct 28",
            contents: [
              {
                content_id: "6714cd87ac747",
                content_title: "Pakistan vs England, 1st Test",
                home_team: "Pakistan",
                away_team: "England",
                home_team_icon: "https://cms.mysports.com.bd/images/team_flag/Pakistan-1729414444-7925816.png",
                away_team_icon: "https://cms.mysports.com.bd/images/team_flag/England-1729414485-7568885.png",
                home_team_score: "PAK 556 & 220",
                away_team_score: "ENG 823/7 d",
                match_status: "completed",
                match_date: "2024-10-07",
                match_time: "10:00 AM",
                match_result: "England won by an innings and 47 runs"
              },
              {
                content_id: "6714cd87ac748",
                content_title: "Pakistan vs England, 2nd Test",
                home_team: "Pakistan",
                away_team: "England",
                home_team_icon: "https://cms.mysports.com.bd/images/team_flag/Pakistan-1729414444-7925816.png",
                away_team_icon: "https://cms.mysports.com.bd/images/team_flag/England-1729414485-7568885.png",
                home_team_score: "PAK 366 & 221",
                away_team_score: "ENG 291 & 144",
                match_status: "completed",
                match_date: "2024-10-15",
                match_time: "10:00 AM",
                match_result: "Pakistan won by 152 runs"
              },
              {
                content_id: "6714cd87ac749",
                content_title: "Pakistan vs England, 3rd Test",
                home_team: "Pakistan",
                away_team: "England",
                home_team_icon: "https://cms.mysports.com.bd/images/team_flag/Pakistan-1729414444-7925816.png",
                away_team_icon: "https://cms.mysports.com.bd/images/team_flag/England-1729414485-7568885.png",
                home_team_score: "PAK 344 & 37/1",
                away_team_score: "ENG 267 & 112",
                match_status: "completed",
                match_date: "2024-10-24",
                match_time: "10:00 AM",
                match_result: "Pakistan won by 9 wickets"
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for live scores (refresh every 30 seconds)
    const interval = setInterval(async () => {
      try {
        const liveScoreResponse = await fetch('https://apiv2.mysports.com.bd/api/v1/contentinfo/live-score');
        if (liveScoreResponse.ok) {
          const liveScoreData = await liveScoreResponse.json();
          setLiveScores(liveScoreData);
        }
      } catch (err) {
        console.error('Error polling live scores:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="mt-4 px-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading matches...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-4 px-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 text-center text-red-600">
            <p>Error: {error}</p>
            <p className="text-sm text-gray-600 mt-2">Showing cached data</p>
          </div>
        </div>
      </section>
    );
  }

  // Find live matches
  const liveMatches = matches.flatMap(playlist => 
    playlist.contents.filter(match => match.match_status === 'live')
  );

  // Find completed matches
  const completedMatches = matches.flatMap(playlist =>
    playlist.contents.filter(match => match.match_status === 'completed')
  );

  // Find upcoming matches (not started)
  const upcomingMatches = matches.flatMap(playlist =>
    playlist.contents.filter(match => !match.match_status || match.match_status === 'upcoming')
  );

  // Get the first playlist for header info
  const primaryPlaylist = matches[0] || {
    playlist_title: "No Matches Available",
    playlist_description: "Check back later for upcoming matches"
  };

  return (
    <section className="mt-4 px-4">
      {/* Outer Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        
        {/* Match Header Section */}
        <div className="flex items-center justify-between p-3 pb-2 bg-[#464646]">
          <h2 className="text-sm font-semibold text-white">
            {primaryPlaylist.playlist_title}
          </h2>
          <span className="text-sm font-medium text-white">
            {primaryPlaylist.playlist_description.split('.')[1]?.trim() || 'No date range'}
          </span>
        </div>

        {/* Live Matches Section */}
        {liveMatches.length > 0 && (
          <>
            {liveMatches.map((match, index) => {
              // Find live score for this match
              const liveScore = liveScores.find(score => score.content_id === match.content_id);
              
              return (
                <LiveMatchCard
                  key={`live-${match.content_id}-${index}`}
                  series={match.content_title}
                  innings="1st innings"
                  team1={{
                    name: match.home_team,
                    flag: match.home_team_icon || getFlagUrl(match.home_team),
                    score: liveScore ? parseScore(liveScore.home_team_score) : parseScore(match.home_team_score)
                  }}
                  team2={{
                    name: match.away_team,
                    flag: match.away_team_icon || getFlagUrl(match.away_team),
                    score: liveScore ? parseScore(liveScore.away_team_score) : parseScore(match.away_team_score),
                    overs: "36.2 ov" // This would come from API if available
                  }}
                  status="live"
                />
              );
            })}
          </>
        )}

        {/* Completed Matches Section */}
        {completedMatches.length > 0 && (
          <>
            {completedMatches.slice(0, 2).map((match, index) => (
              <CompletedMatchCard
                key={`completed-${match.content_id}-${index}`}
                series={match.content_title}
                team1={{
                  name: match.home_team,
                  flag: match.home_team_icon || getFlagUrl(match.home_team),
                  score: parseScore(match.home_team_score)
                }}
                team2={{
                  name: match.away_team,
                  flag: match.away_team_icon || getFlagUrl(match.away_team),
                  score: parseScore(match.away_team_score)
                }}
                result={match.match_result}
              />
            ))}
          </>
        )}

        {/* No Live Matches Message */}
        {liveMatches.length === 0 && completedMatches.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No live matches currently. Check upcoming matches below.
          </div>
        )}

        {/* Upcoming Matches Section */}
        {upcomingMatches.length > 0 && (
          <div className="flex border border-gray-200 m-2 rounded-lg">
            {upcomingMatches.slice(0, 2).map((match, index) => (
              <React.Fragment key={`upcoming-${match.content_id}-${index}`}>
                <UpcomingMatchBlock 
                  series={match.content_title}
                  date={new Date(match.match_date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  team1={{
                    name: match.home_team,
                    flag: match.home_team_icon || getFlagUrl(match.home_team)
                  }}
                  team2={{
                    name: match.away_team,
                    flag: match.away_team_icon || getFlagUrl(match.away_team)
                  }}
                  time={match.match_time}
                />
                {index === 0 && upcomingMatches.length > 1 && (
                  <div className="w-px bg-gray-200 my-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* No Upcoming Matches Message */}
        {upcomingMatches.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No upcoming matches scheduled
          </div>
        )}
        
        {/* Down Arrow/Footer element */}
        <div className="flex justify-center p-1">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
      </div>
    </section>
  );
}