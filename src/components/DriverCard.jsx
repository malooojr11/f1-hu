import { useState } from 'react'
import { motion } from 'framer-motion'

const teamColors = {
    red_bull: '#3671C6',
    ferrari: '#E8002D',
    mercedes: '#27F4D2',
    mclaren: '#FF8000',
    aston_martin: '#229971',
    alpine: '#FF87BC',
    williams: '#64C4FF',
    haas: '#B6BABD',
    rb: '#6692FF',
    audi: '#F50537',
    cadillac: '#C0C0C0',
    sauber: '#52E252',
}

function getAge(dateOfBirth) {
    const diff = Date.now() - new Date(dateOfBirth).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

const face = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
}

export default function DriverCard({ driver }) {
    const [flipped, setFlipped] = useState(false)

    const team = driver.Constructors[0]
    const color = teamColors[team.constructorId] || '#E10600'
    const logo = `/logos/${team.constructorId}.svg`

    // المركز الأول أسرع، والباقي أبطأ شوية
    const raceDuration = 1.2 + Number(driver.position) * 0.2

    // على الموبايل مفيش hover، فبنستخدم الضغط
    const canHover =
        typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

    const facts = [
        ['Season position', `P${driver.position}`],
        ['Points', driver.points],
        ['Wins', driver.wins],
        ['Number', driver.Driver.permanentNumber ?? '-'],
        ['Age', getAge(driver.Driver.dateOfBirth)],
        ['Nationality', driver.Driver.nationality],
    ]

    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-80"
            style={{ perspective: 1000 }}
            onMouseEnter={() => canHover && setFlipped(true)}
            onMouseLeave={() => canHover && setFlipped(false)}
            onClick={() => !canHover && setFlipped((f) => !f)}
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
            >
                {/* الوش الأمامي */}
                <div
                    className="absolute inset-0 bg-zinc-900 rounded-xl p-6 text-white border-t-4 overflow-hidden"
                    style={{ ...face, borderColor: color }}
                >
                    <p className="text-5xl font-black" style={{ color }}>
                        {driver.position}
                    </p>
                    <h3 className="mt-4 text-xl font-bold">
                        {driver.Driver.givenName} {driver.Driver.familyName}
                    </h3>
                    <p className="text-gray-400">{team.name}</p>
                    <p className="mt-3 font-bold">{driver.points} pts</p>

                    {/* الحلبة */}
                    <div className="absolute bottom-4 left-4 right-14 h-12 overflow-hidden">
                        {/* خط الحلبة */}
                        <div className="absolute inset-x-0 top-1/2 border-t border-white/20" />

                        {/* الشعار اللي بيجري */}
                        <motion.div
                            className="absolute top-0 h-12"
                            initial={{ left: '0%' }}
                            whileInView={{ left: '100%' }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{
                                duration: raceDuration,
                                delay: 0.3,
                                ease: [0.2, 0.7, 0.3, 1],
                            }}
                        >
                            <div className="relative h-12 w-12 -translate-x-full">
                                {/* ذيل السرعة */}
                                <div
                                    className="absolute right-full top-1/2 h-1 w-24 -translate-y-1/2 rounded-full"
                                    style={{
                                        background: `linear-gradient(to left, ${color}, transparent)`,
                                    }}
                                />
                                <img
                                    src={logo}
                                    alt={team.name}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                    className="relative h-12 w-12 rounded-lg bg-white object-contain p-1.5"
                                    style={{ boxShadow: `1 1 1 2px ${color}`}}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* علم النهاية */}
                    <span className="absolute bottom-6 right-4 text-2xl">🏁</span>
                </div>

                {/* الوش الخلفي */}
                <div
                    className="absolute inset-0 rounded-xl p-5 text-white flex flex-col items-center border-2"
                    style={{
                        ...face,
                        transform: 'rotateY(180deg)',
                        borderColor: color,
                        background: `linear-gradient(160deg, #18181b 55%, ${color}55)`,
                    }}
                >
                    <img
                        src={logo}
                        alt={team.name}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                        className="h-14 w-14 rounded-lg bg-white object-contain p-1.5"
                        style={{ boxShadow: `0 0 0 2px ${color}` }}
                    />
                    <p className="mt-2 mb-3 text-sm text-gray-400">{team.name}</p>

                    <ul className="w-full space-y-1.5 text-sm">
                        {facts.map(([label, value]) => (
                            <li
                                key={label}
                                className="flex justify-between border-b border-white/10 pb-1"
                            >
                                <span className="text-gray-400">{label}</span>
                                <span className="font-bold">{value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </motion.div>
    )
}