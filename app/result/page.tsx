'use client';

import { useEffect } from "react";
import { useMatchResultStore } from "@/store/useMatchResultStore";

// ======================================================
// MATCH RESULT CARD COMPONENT (Define BEFORE ResultPage)
// ======================================================

const MatchResultCard = ({ result }: { result: any }) => {
  const TeamRow = ({
    name,
    score,
    icon,
    highlight
  }: {
    name: string;
    score: string;
    icon: string;
    highlight: boolean;
  }) => (
    <div className="flex justify-between items-center h-10">
      <div className="flex items-center space-x-2">
        <img
          src={icon}
          alt={name}
          className="w-6 h-6 rounded-sm object-cover"
        //   onError={(e) => ((e.target as HTMLImageElement).src = '/fallback.png')}
        />
        <span
          className={`font-medium ${
            highlight ? "text-green-600 font-bold" : "text-gray-800"
          }`}
        >
          {name}
        </span>
      </div>

      <span
        className={`text-base font-medium ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {score}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 mx-4 my-4">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-gray-700">
          {result.content_title}
        </span>
        <span className="text-xs font-medium text-gray-600">
          {result.match_date}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-2">
        <TeamRow
          name={result.home_team}
          score={result.home_team_score}
          icon={result.home_team_icon}
          highlight={result.winning_team === "home_team"}
        />
        <TeamRow
          name={result.away_team}
          score={result.away_team_score}
          icon={result.away_team_icon}
          highlight={result.winning_team === "away_team"}
        />
      </div>

      {/* Result */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-red-500">
          {result.match_result || "Match completed"}
        </p>
      </div>
    </div>
  );
};

// ===================
// MAIN PAGE COMPONENT
// ===================

export default function ResultPage() {
  const { results, loading, error, fetchResults } = useMatchResultStore();

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="min-h-screen bg-gray-100 relative z-10 rounded-t-2xl flex flex-col">
      <main className="flex-1 overflow-y-auto pt-2 pb-2">

        {loading && (
          <p className="text-center text-gray-600 pt-10">
            Loading match results…
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 pt-10">{error}</p>
        )}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-600 pt-10">
            No match results available.
          </p>
        )}

        {results.map((result: any) => (
          <MatchResultCard key={result.content_id} result={result} />
        ))}
      </main>
    </div>
  );
}
