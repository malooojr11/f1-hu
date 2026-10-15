import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section className="relative isolate min-h-screen overflow-hidden bg-black">
            {/* الفيديو في الخلفية */}
            <video
                className="absolute inset-0 w-full h-full object-cover brightness-200 contrast-125 saturate-150"
                src="/hero-text-bg.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="relative min-h-screen bg-black mix-blend-multiply flex items-center justify-center text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="font-display font-black text-white leading-none text-7xl sm:text-9xl md:text-[12rem]"
                >
                    FORMULA HUB
                </motion.h1>
            </div>

            {/* الجملة التحتانية برا طبقة الـ blend */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-16 inset-x-0 text-center text-xl md:text-3xl text-gray-300"
            >
                Live standings. Real data. Pure speed.
            </motion.p>
        </section>
    )
}