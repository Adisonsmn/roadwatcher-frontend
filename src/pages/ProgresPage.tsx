import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle2, XCircle, MapPin, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import api from '@/lib/api'

interface Report {
  id: string
  fotoUrl: string
  area: string | null
  namaJalan: string | null
  jenisKerusakan: string | null
  deskripsi: string | null
  status: string
  ratingKecepatan: number | null
  ratingKualitas: number | null
  jalanLayak: boolean | null
  ratingKomunikasi: number | null
  kepuasan: string | null
  kritikSaran: string | null
  createdAt: string
  userId: string | null
  user: { id: string; nama: string } | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  gagal_terkirim: { label: 'Gagal Terkirim', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
  terkirim_pending: { label: 'Terkirim - Pending', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', icon: Clock },
  terkirim_in_progress: { label: 'Terkirim - In-Progress', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: Clock },
  terkirim_rejected: { label: 'Terkirim - Rejected', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-300', icon: XCircle },
  terkirim_solved: { label: 'Terkirim - Solved', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle2 },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function ProgresPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  const [expandedDesc, setExpandedDesc] = useState<Record<string, boolean>>({})

  const toggleDesc = (id: string) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    // Get current user id if logged in
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setCurrentUserId(JSON.parse(stored).id) } catch { /* */ }
    }
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports')
      setReports(res.data.reports)
    } catch {
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar forceScrolled />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-navy-700 to-navy-500 rounded-full" />
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-navy-900">Status Laporan</h1>
            </div>
            <p className="text-navy-500 text-sm ml-4">Semua laporan kerusakan jalan dari masyarakat</p>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-navy-100 p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-navy-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-navy-100 rounded w-3/4" />
                      <div className="h-3 bg-navy-100 rounded w-1/2" />
                      <div className="h-6 bg-navy-100 rounded w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-navy-100 shadow-sm p-8 text-center">
              <div className="w-14 h-14 bg-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-navy-400" />
              </div>
              <h3 className="text-lg font-heading font-bold text-navy-800 mb-2">Belum ada laporan</h3>
              <p className="text-navy-500 text-sm mb-6">Belum ada laporan kerusakan jalan yang masuk.</p>
              <Link to="/lapor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-600/20 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all">
                <FileText size={18} /> Buat Laporan
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {reports.map((report, index) => {
                  const config = STATUS_CONFIG[report.status] || STATUS_CONFIG.terkirim_pending
                  const StatusIcon = config.icon
                  const isOwn = currentUserId && report.userId === currentUserId

                  return (
                    <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isOwn ? 'border-teal-200' : 'border-navy-100'}`}>
                      <div className="p-5">
                        <div className="flex gap-4">
                          {/* Photo */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-navy-100">
                            <img src={report.fotoUrl ? report.fotoUrl.split(',')[0] : ''} alt="Foto laporan" className="w-full h-full object-cover" loading="lazy" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                {report.namaJalan && (
                                  <p className="text-sm font-semibold text-navy-800 truncate">{report.namaJalan}</p>
                                )}
                                {report.area && (
                                  <p className="flex items-center gap-1 text-xs text-navy-500 mt-0.5">
                                    <MapPin size={12} />{report.area}
                                  </p>
                                )}
                              </div>
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shrink-0 ${config.bgColor} ${config.color}`}>
                                <StatusIcon size={13} />{config.label}
                              </div>
                            </div>

                            {report.deskripsi && (
                              <div className="mt-2">
                                <button 
                                  onClick={() => toggleDesc(report.id)}
                                  className="flex items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-800 transition-colors"
                                >
                                  {expandedDesc[report.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  {expandedDesc[report.id] ? 'Tutup Deskripsi' : 'Lihat Deskripsi'}
                                </button>
                                <AnimatePresence>
                                  {expandedDesc[report.id] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <p className="text-xs text-navy-500 mt-2 p-3 bg-navy-50 rounded-xl border border-navy-100 whitespace-pre-line">
                                        {report.deskripsi}
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-2">
                              <p className="flex items-center gap-1 text-[11px] text-navy-400">
                                <Calendar size={11} />{formatDate(report.createdAt)}
                              </p>
                              {report.user && (
                                <p className="flex items-center gap-1 text-[11px] text-navy-400">
                                  <User size={11} />{report.user.nama}
                                </p>
                              )}
                              {isOwn && (
                                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold">Laporan Anda</span>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-navy-100 flex justify-end">
                              <Link
                                to={`/progres/${report.id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/10 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all"
                              >
                                Lihat Jawaban
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
