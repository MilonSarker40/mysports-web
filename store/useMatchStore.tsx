// store/useMatchStore.ts
import { create } from 'zustand';
import api from '../utils/api'; 

// --- Data Types from API (Copied from MatchList.tsx) ---
interface ContentItem {
    playlist_title: string;
    content_id: string;
    content_title: string;
    home_team: string;
    away_team: string;
    home_team_icon: string;
    away_team_icon: string;
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

// --- Store State & Actions ---
interface MatchState {
    matchData: ContentItem | null;
    loading: boolean;
    error: string | null;
    fetchMatchData: (isPolling?: boolean) => Promise<void>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
    matchData: null,
    loading: true,
    error: null,

    fetchMatchData: async (isPolling = false) => {
        // Only set loading/error state visually on initial load, not during polling
        if (!isPolling) {
            set({ loading: true, error: null });
        }
        
        try {
            // 1. Fetch live score data
            const liveScoreResponse = await api.get<LiveScoreResponse>('/contentinfo/live-score');
            const liveScore = liveScoreResponse.data;
            const targetContentId = liveScore.content_id;

            // Handle 304 Not Modified / empty data during polling
            if (!liveScore.content_id) {
                // If it's a polling request and we have old data, return without updating state
                if (isPolling && get().matchData) {
                    return;
                }
            }
            
            // 2. Fetch all content data to get details (teams, flags, series info)
            // CORRECTED: Using api.get instead of api.post for contentinfo/all
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
                const updatedMatchData: ContentItem = {
                    ...matchedContent,
                    playlist_title: playlistTitle || matchedContent.content_title,
                    // Override score and status with the most up-to-date live data
                    home_team_score: liveScore.home_team_score,
                    away_team_score: liveScore.away_team_score,
                    match_status: liveScore.match_status,
                };
                set({ matchData: updatedMatchData });
            } else {
                 set({ error: "Live match details not found in content list." });
            }

        } catch (e) {
            console.error("Error fetching match data:", e);
            set({ error: "Failed to load match data from API." });
        } finally {
            if (!isPolling) {
                set({ loading: false });
            }
        }
    },
}));