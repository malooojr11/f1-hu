import { useState, useEffect } from 'react'
import DriverCard from './DriverCard'

export default function DriverCards() {
    const [drivers, setDrivers] = useState([])

    useEffect(() => {
        fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json')
            .then((res) => res.json())
            .then((data) => {
                const list = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
                setDrivers(list.slice(0, 8))
            })
    }, [])

    return (
        <section className="bg-black py-20 px-4">
            <h2 className="text-4xl font-bold text-white text-center mb-10">
                Top <span className="text-red-600">Drivers</span>
            </h2>
            <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {drivers.map((d) => (
                    <DriverCard key={d.Driver.driverId} driver={d} />
                ))}
            </div>
        </section>
    )
}