import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import UtilityBar from './UtilityBar.jsx'
import Header from './Header.jsx'
import MainNav from './MainNav.jsx'
import StatutoryTicker from './StatutoryTicker.jsx'
import Footer from './Footer.jsx'

const SCALES = [0.93, 1, 1.1]

export default function Layout() {
  const [fontScale, setFontScale] = useState(1)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname])

  const scale = SCALES[fontScale]

  return (
    <div className="bg-[#f0f4f9] text-[#0d1c2e] antialiased flex flex-col min-h-screen text-[13px] font-sans">
      {/* Tricolour accent stripe */}
      <div className="w-full h-1 flex shrink-0">
        <div className="h-full w-1/3 bg-saffron" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-indiagreen" />
      </div>

      <div
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%` }}
        className="flex flex-col flex-1"
      >
        <UtilityBar fontScale={fontScale} onFontScale={setFontScale} />
        <Header />
        <MainNav />
        <StatutoryTicker />

        <main className="flex-1 max-w-[1720px] w-full mx-auto px-6 py-8 flex flex-col gap-8" id="main-content">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  )
}
