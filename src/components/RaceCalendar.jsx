import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// التاريخ والساعة (UTC) من الـ API → وقت واحد نقدر نقارنه
function raceTime(race) {
    return new Date(`${race.date}T${race.time ?? '12:00:00Z'}`).getTime()
}

function Countdown({ target }) {
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(id) // ينضف الـ timer لما الـ component يتشال
    }, [])

    const diff = Math.max(0, target - now)
    const units = [
        ['Days', Math.floor(diff / 86400000)],
        ['Hours', Math.floor(diff / 3600000) % 24],
        ['Min', Math.floor(diff / 60000) % 60],
        ['Sec', Math.floor(diff / 1000) % 60],
    ]

    return (
        <div className="mt-8 flex justify-center gap-3 sm:gap-6">
            {units.map(([label, value]) => (
                <div
                    key={label}
                    className="w-20 sm:w-28 rounded-xl bg-black/60 border border-white/10 py-4"
                >
                    <p className="font-display text-3xl sm:text-5xl font-black text-white">
                        {String(value).padStart(2, '0')}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-red-500">
                        {label}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default function RaceCalendar() {
    const [races, setRaces] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('https://api.jolpi.ca/ergast/f1/current.json')
            .then((res) => res.json())
            .then((data) => {
                setRaces(data.MRData.RaceTable.Races)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p className="bg-zinc-950 text-white text-center py-20">Loading...</p>
    }

    const next = races.find((r) => raceTime(r) > Date.now())

    return (
        <section id="calendar" className="scroll-mt-16 bg-zinc-950 py-20 px-4">
            <h2 className="text-4xl font-bold text-white text-center mb-10">
                Race <span className="text-red-600">Calendar</span>
            </h2>

            {/* السباق الجاي */}
            {next ? (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center rounded-2xl bg-gradient-to-br from-red-700/40 to-zinc-900 border border-red-600/40 p-8"
                >
                    <p className="text-sm uppercase tracking-widest text-red-400">
                        Next race · Round {next.round}
                    </p>
                    <h3 className="mt-2 text-3xl sm:text-4xl font-black text-white">
                        {next.raceName}
                    </h3>
                    <p className="mt-2 text-gray-400">
                        {next.Circuit.circuitName} · {next.Circuit.Location.locality},{' '}
                        {next.Circuit.Location.country}
                    </p>
                    <Countdown target={raceTime(next)} />
                </motion.div>
            ) : (
                <p className="text-center text-gray-400">
                    The season is over. See you next year! 🏁
                </p>
            )}

            {/* كل السباقات */}
            <div className="max-w-6xl mx-auto mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {races.map((race) => {
                    const isPast = raceTime(race) < Date.now()
                    const isNext = next && race.round === next.round

                    return (
                        <div
                            key={race.round}
                            className={`rounded-xl p-5 border transition ${isNext
                                    ? 'border-red-600 bg-red-950/30'
                                    : 'border-white/10 bg-zinc-900'
                                } ${isPast ? 'opacity-40' : ''}`}
                        >
                            <p className="text-xs text-red-500 font-bold">
                                ROUND {race.round}
                            </p>
                            <h4 className="mt-1 font-bold text-white">{race.raceName}</h4>
                            <p className="text-sm text-gray-400">
                                {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                            </p>
                            <p className="mt-2 text-sm text-gray-300">
                                {new Date(race.date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    timeZone: 'UTC',
                                })}
                            </p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}