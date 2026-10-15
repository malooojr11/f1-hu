import Hero from './components/Hero'
import Standings from './components/Standings'
import Navbar from './components/Navbar'
import DriverCards from './components/Drivercards'
import RaceCalendar from './components/RaceCalendar'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <DriverCards/>
      <RaceCalendar/>
      <Standings />
    </>
  )
}