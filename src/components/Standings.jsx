import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { teamColors, DEFAULT_COLOR } from '../data/teamColors'

const API = 'https://api.jolpi.ca/ergast/f1/current'

function Row({ index, position, title, subtitle, points, wins, color, percent }) {
    return (
        <motion.li
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.4 }}
            className="relative overflow-hidden rounded-lg bg-zinc-900 p-4 text-white"
        >
            {/* شريط لون الفريق على الجنب */}
            <span
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ background: color }}
            />

            <div className="flex items-center gap-4 pl-2">
                <span className="w-8 text-2xl font-black text-gray-500">{position}</span>

                <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{title}</p>
                    <p className="truncate text-sm text-gray-400">{subtitle}</p>
                </div>

                <div className="text-right">
                    <p className="font-black" style={{ color }}>
                        {points} <span className="text-xs text-gray-400">pts</span>
                    </p>
                    <p className="text-xs text-gray-500">{wins} wins</p>
                </div>
            </div>

            {/* شريط النقاط مقارنة بالمتصدر */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                />
            </div>
        </motion.li>
    )
}

export default function Standings() {
    const [tab, setTab] = useState('drivers')
    const [drivers, setDrivers] = useState([])
    const [constructors, setConstructors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        Promise.all([
            fetch(`${API}/driverStandings.json`).then((r) => r.json()),
            fetch(`${API}/constructorStandings.json`).then((r) => r.json()),
        ])
            .then(([d, c]) => {
                setDrivers(d.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [])
                setConstructors(
                    c.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? []
                )
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    const list = tab === 'drivers' ? drivers : constructors
    const leaderPoints = Number(list[0]?.points) || 1

    return (
        <section id="standings" className="scroll-mt-16 bg-zinc-950 py-20 px-4">
            <h2 className="mb-8 text-center text-4xl font-bold text-white">
                <span className="text-red-600">Championship</span> Standings
            </h2>

            {/* التابات */}
            <div className="mx-auto mb-8 flex w-fit rounded-full bg-zinc-900 p-1">
                {['drivers', 'constructors'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="relative rounded-full px-6 py-2 text-sm font-bold capitalize"
                    >
                        {tab === t && (
                            <motion.span
                                layoutId="tab-pill"
                                className="absolute inset-0 rounded-full bg-red-600"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className={`relative ${tab === t ? 'text-white' : 'text-gray-400'}`}>
                            {t}
                        </span>
                    </button>
                ))}
            </div>

            {loading && <p className="text-center text-gray-400">Loading...</p>}
            {error && (
                <p className="text-center text-red-400">
                    Couldn't load standings. Try refreshing the page.
                </p>
            )}

            <AnimatePresence mode="wait">
                <motion.ul
                    key={tab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mx-auto max-w-2xl space-y-3"
                >
                    {tab === 'drivers' &&
                        drivers.map((d, i) => {
                            const id = d.Constructors[0]?.constructorId
                            return (
                                <Row
                                    key={d.Driver.driverId}
                                    index={i}
                                    position={d.position}
                                    title={`${d.Driver.givenName} ${d.Driver.familyName}`}
                                    subtitle={d.Constructors[0]?.name}
                                    points={d.points}
                                    wins={d.wins}
                                    color={teamColors[id] || DEFAULT_COLOR}
                                    percent={(Number(d.points) / leaderPoints) * 100}
                                />
                            )
                        })}

                    {tab === 'constructors' &&
                        constructors.map((c, i) => (
                            <Row
                                key={c.Constructor.constructorId}
                                index={i}
                                position={c.position}
                                title={c.Constructor.name}
                                subtitle={c.Constructor.nationality}
                                points={c.points}
                                wins={c.wins}
                                color={teamColors[c.Constructor.constructorId] || DEFAULT_COLOR}
                                percent={(Number(c.points) / leaderPoints) * 100}
                            />
                        ))}
                </motion.ul>
            </AnimatePresence>
        </section>
    )
}