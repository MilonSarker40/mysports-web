'use client'

import React from 'react'

/* =========================
   TYPES
========================= */

interface Team {
  name: string
  logo: string
  score?: string
}

interface LiveMatch {
  label: string
  team1: Team
  team2: Team
}

interface UpcomingMatch {
  label: string
  date: string
  time: string
  team1: Team
  team2: Team
}

interface FootballMatchData {
  title: string
  dateRange: string
  liveMatch: LiveMatch
  upcomingMatches: UpcomingMatch[]
}

/* =========================
   LOGOS (PLACEHOLDERS)
========================= */

const BARCELONA_LOGO_URL = 'https://flagcdn.com/w20/bd.png'
const REAL_MADRID_LOGO_URL = 'https://flagcdn.com/w20/za.png'
const ATHLETIC_CLUB_LOGO_URL = 'https://flagcdn.com/w20/bd.png'
const ESPANYOL_LOGO_URL = 'https://flagcdn.com/w20/za.png'
const REAL_BETIS_LOGO_URL = 'https://flagcdn.com/w20/bd.png'
const ATLETICO_MADRID_LOGO_URL = 'https://flagcdn.com/w20/za.png'

/* =========================
   SUB-COMPONENTS
========================= */

interface LiveMatchCardProps {
  label: string
  team1: Team
  team2: Team
}

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({
  label,
  team1,
  team2,
}) => (
  <div className="border border-b-2 border-b-red-700 border-gray-200 m-2 p-3 pb-0 rounded-t-lg">
    <div className="text-xs mb-3 text-gray-600 font-medium">
      {label}
    </div>

    {/* Team 1 */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <img
          src={team1.logo}
          alt={`${team1.name} Logo`}
          className="w-5 h-5 mr-2 rounded-full shadow-sm border"
        />
        <span className="text-sm">{team1.name}</span>
      </div>
      <span className="font-semibold">{team1.score}</span>
    </div>

    {/* Team 2 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={team2.logo}
          alt={`${team2.name} Logo`}
          className="w-5 h-5 mr-2 rounded-full shadow-sm border"
        />
        <span className="text-sm">{team2.name}</span>
      </div>
      <span className="font-semibold">{team2.score}</span>
    </div>

    <div className="mt-4 flex justify-center">
      <button className="flex items-center px-4 py-1.5 bg-red-600 text-white text-sm rounded-t-lg">
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Watch Live
      </button>
    </div>
  </div>
)

interface UpcomingMatchBlockProps extends UpcomingMatch {}

const UpcomingMatchBlock: React.FC<UpcomingMatchBlockProps> = ({
  label,
  date,
  time,
  team1,
  team2,
}) => (
  <div className="w-1/2 p-3">
    <div className="flex justify-between text-xs mb-2">
      <span className="font-medium">{label}</span>
      <span className="font-medium">{date}</span>
    </div>

    <div className="flex items-center mb-1">
      <img src={team1.logo} className="w-4 h-4 mr-2 rounded-full" />
      <span className="text-sm">{team1.name}</span>
    </div>

    <div className="flex items-center mb-2">
      <img src={team2.logo} className="w-4 h-4 mr-2 rounded-full" />
      <span className="text-sm">{team2.name}</span>
    </div>

    <div className="text-xs text-red-600 font-medium">
      Starts at {time}
    </div>
  </div>
)

/* =========================
   MAIN COMPONENT
========================= */

interface FootballMatchProps {
  data?: FootballMatchData
}

export default function FootballMatch({
  data,
}: FootballMatchProps) {
  const defaultData: FootballMatchData = {
    title: 'La Liga 21-22',
    dateRange: 'Sep - Dec',
    liveMatch: {
      label: 'Semifinal',
      team1: {
        name: 'Barcelona',
        logo: BARCELONA_LOGO_URL,
        score: '2',
      },
      team2: {
        name: 'Real Madrid',
        logo: REAL_MADRID_LOGO_URL,
        score: '0',
      },
    },
    upcomingMatches: [
      {
        label: 'Match Day 24',
        date: 'Fri Jul 7',
        time: '3:00 pm',
        team1: { name: 'Athletic Club', logo: ATHLETIC_CLUB_LOGO_URL },
        team2: { name: 'Espanyol', logo: ESPANYOL_LOGO_URL },
      },
      {
        label: 'Final',
        date: 'Fri Jul 7',
        time: '3:00 pm',
        team1: { name: 'Real Betis', logo: REAL_BETIS_LOGO_URL },
        team2: {
          name: 'Atletico Madrid',
          logo: ATLETICO_MADRID_LOGO_URL,
        },
      },
    ],
  }

  const { title, dateRange, liveMatch, upcomingMatches } =
    data ?? defaultData

  return (
    <section className="mt-4 px-4">
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="flex justify-between p-3 bg-[#464646] text-white">
          <h2 className="text-sm font-semibold">{title}</h2>
          <span className="text-sm">{dateRange}</span>
        </div>

        <LiveMatchCard {...liveMatch} />

        <div className="flex m-2 border rounded">
          {upcomingMatches.slice(0, 2).map((match, i) => (
            <React.Fragment key={i}>
              {i === 1 && <div className="w-px bg-gray-200 my-2" />}
              <UpcomingMatchBlock {...match} />
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center p-1">
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
