import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingSplash from '@/components/LoadingSplash'
import BerandaPage from '@/pages/BerandaPage'
import LaporPage from '@/pages/LaporPage'
import FaqPage from '@/pages/FaqPage'
import MasukPage from '@/pages/MasukPage'
import DaftarPage from '@/pages/DaftarPage'
import ProgresPage from '@/pages/ProgresPage'
import ScrollToTop from '@/components/ScrollToTop'

function App() {
  const [loading, setLoading] = useState(true)

  const handleLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Loading Splash */}
      {loading && <LoadingSplash onComplete={handleLoadComplete} />}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Routes>
          <Route path="/" element={<BerandaPage />} />
          <Route path="/lapor" element={<LaporPage />} />
          <Route path="/progres" element={<ProgresPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/masuk" element={<MasukPage />} />
          <Route path="/daftar" element={<DaftarPage />} />
        </Routes>
      </motion.div>
    </BrowserRouter>
  )
}

export default App
