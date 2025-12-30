'use client'

import React from 'react'

/* =========================
   TYPES
========================= */

interface Team {
  name: string
  flag: string
  score?: string
  overs?: string
}

interface LiveMatch {
  series: string
  innings: string
  team1: Team
  team2: Team
}

interface UpcomingMatch {
  series: string
  date: string
  time: string
  team1: Team
  team2: Team
}

interface TournamentData {
  title: string
  dateRange: string
  liveMatch: LiveMatch
  upcomingMatches: UpcomingMatch[]
}

/* =========================
   FLAGS
========================= */

const BANGLADESH_FLAG_URL = 'https://flagcdn.com/w20/bd.png'
const SOUTH_AFRICA_FLAG_URL = 'https://flagcdn.com/w20/za.png'

/* =========================
   SUB COMPONENTS
========================= */

interface LiveMatchCardProps {
  series: string
  innings: string
  team1: Team
  team2: Team
}

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({
  series,
  innings,
  team1,
  team2,
}) => (
  <div className="border border-b-2 border-b-red-700 border-gray-200 m-2 p-3 pb-0 rounded-t-lg">
    <div className="flex justify-between items-center text-xs mb-3">
      <span className="text-gray-600 font-medium">{series}</span>
      <span className="text-green-600 font-semibold">{innings}</span>
    </div>

    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <img
          src={team1.flag}
          alt={`${team1.name} Flag`}
          className="w-5 h-5 mr-2 rounded-full"
        />
        <span className="text-sm">{team1.name}</span>
      </div>
      <span className="text-sm font-semibold">{team1.score}</span>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={team2.flag}
          alt={`${team2.name} Flag`}
          className="w-5 h-5 mr-2 rounded-full"
        />
        <span className="text-sm">{team2.name}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{team2.score}</div>
        <div className="text-xs text-gray-500">{team2.overs}</div>
      </div>
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

const UpcomingMatchBlock: React.FC<UpcomingMatch> = ({
  series,
  date,
  time,
  team1,
  team2,
}) => (
  <div className="w-1/2 p-3">
    <div className="flex justify-between text-xs mb-2">
      <span className="text-gray-600 font-medium">{series}</span>
      <span className="text-gray-600 font-medium">{date}</span>
    </div>

    <div className="flex items-center mb-1">
      <img src={team1.flag} className="w-4 h-4 mr-2 rounded-full" />
      <span className="text-sm">{team1.name}</span>
    </div>

    <div className="flex items-center mb-2">
      <img src={team2.flag} className="w-4 h-4 mr-2 rounded-full" />
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

interface TournamentsProps {
  data?: TournamentData
}

export default function Tournaments({ data }: TournamentsProps) {
  const defaultData: TournamentData = {
    title: 'T20 World Cup 2021',
    dateRange: 'Sep 5 - 25',
    liveMatch: {
      series: 'ODI 1 of 3',
      innings: '1st innings',
      team1: {
        name: 'Bangladesh',
        flag: BANGLADESH_FLAG_URL,
        score: '320/8',
      },
      team2: {
        name: 'South Africa',
        flag: SOUTH_AFRICA_FLAG_URL,
        score: '287/4',
        overs: '36.2 ov',
      },
    },
    upcomingMatches: [
      {
        series: 'ODI 2 of 3',
        date: 'Fri Jul 7',
        time: '3:00 pm',
        team1: {
          name: 'Bangladesh',
          flag: BANGLADESH_FLAG_URL,
        },
        team2: {
          name: 'South Africa',
          flag: SOUTH_AFRICA_FLAG_URL,
        },
      },
      {
        series: 'ODI 2 of 3',
        date: 'Fri Jul 7',
        time: '3:00 pm',
        team1: {
          name: 'Bangladesh',
          flag: BANGLADESH_FLAG_URL,
        },
        team2: {
          name: 'South Africa',
          flag: SOUTH_AFRICA_FLAG_URL,
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

        <div className="flex border m-2 rounded">
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
