import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ToastProvider } from '@/components/Toast'
import LoadingSplash from '@/components/LoadingSplash'
import BerandaPage from '@/pages/BerandaPage'
import LaporPage from '@/pages/LaporPage'
import FaqPage from '@/pages/FaqPage'
import MasukPage from '@/pages/MasukPage'
import DaftarPage from '@/pages/DaftarPage'
import ProgresPage from '@/pages/ProgresPage'
import ReportDetailPage from '@/pages/ReportDetailPage'
import AdminLaporPage from '@/pages/admin/AdminLaporPage'
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import ScrollToTop from '@/components/ScrollToTop'

function App() {
  const [loading, setLoading] = useState(true)

  const handleLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <BrowserRouter>
      <ToastProvider>
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
          <Route path="/progres/:id" element={<ReportDetailPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/masuk" element={<MasukPage />} />
          <Route path="/daftar" element={<DaftarPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/lapor" element={<AdminLaporPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Routes>
      </motion.div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
