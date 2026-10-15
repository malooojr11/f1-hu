import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
    { label: 'Home', href: '#home' },
    { label: 'Drivers', href: '#drivers' },
    { label: 'Standings', href: '#standings' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
                <a href="#home" className="font-display text-xl font-black text-white">
                    F1 <span className="text-red-600">HUB</span>
                </a>

                {/* Desktop links */}
                <ul className="hidden md:flex gap-8">
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Mobile button */}
                <button
                    className="md:hidden text-white text-2xl"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-black/90"
                    >
                        <ul className="flex flex-col gap-4 px-4 py-4">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}