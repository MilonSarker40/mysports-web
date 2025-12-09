import { create } from "zustand";
import api from "@/utils/api";

interface MatchResult {
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
  description: string;
  match_result: string | null;
  is_premium: string;
  winning_team: "home_team" | "away_team" | null;
}

interface MatchResultStore {
  results: MatchResult[];
  loading: boolean;
  error: string | null;

  fetchResults: () => Promise<void>;
}

export const useMatchResultStore = create<MatchResultStore>((set) => ({
  results: [],
  loading: false,
  error: null,

  fetchResults: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.post("/contentinfo/match-result");
      set({
        results: res.data.result || [],
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to load match results",
        loading: false,
      });
    }
  },
}));
