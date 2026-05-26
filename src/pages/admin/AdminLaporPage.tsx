import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Clock, CheckCircle2, XCircle, MapPin, 
  Search, Upload, X, ShieldAlert, BarChart3,
  LogOut, Globe, Check, User, Calendar, ChevronRight, ChevronLeft
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import api from '@/lib/api'

interface Report {
  id: string
  fotoUrl: string
  area: string | null
  namaJalan: string | null
  jenisKerusakan: string | null
  deskripsi: string | null
  status: string
  estimasiSelesai: string | null
  fotoSebelum: string | null
  fotoProses: string | null
  fotoSelesai: string | null
  tglDiterima: string | null
  tglDiverifikasi: string | null
  tglDijadwalkan: string | null
  tglDiproses: string | null
  tglSelesai: string | null
  createdAt: string
  userId: string | null
  user: { id: string; nama: string } | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; dotColor: string; icon: React.ElementType }> = {
  gagal_terkirim:       { label: 'Gagal',       color: 'text-red-400',    bgColor: 'bg-red-500/10 border-red-500/20',     dotColor: 'bg-red-500',    icon: XCircle },
  terkirim_pending:     { label: 'Tertunda',    color: 'text-amber-400',  bgColor: 'bg-amber-500/10 border-amber-500/20', dotColor: 'bg-amber-500',  icon: Clock },
  terkirim_in_progress: { label: 'Diproses',    color: 'text-blue-400',   bgColor: 'bg-blue-500/10 border-blue-500/20',   dotColor: 'bg-blue-500',   icon: Clock },
  terkirim_rejected:    { label: 'Ditolak',     color: 'text-slate-400',  bgColor: 'bg-slate-500/10 border-slate-500/20', dotColor: 'bg-slate-500',  icon: XCircle },
  terkirim_solved:      { label: 'Selesai',     color: 'text-emerald-400',bgColor: 'bg-emerald-500/10 border-emerald-500/20', dotColor: 'bg-emerald-500', icon: CheckCircle2 },
}

export default function AdminLaporPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')

  // Drawer / Management states
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [mgmtStatus, setMgmtStatus] = useState('')
  const [mgmtEstimasi, setMgmtEstimasi] = useState('')
  const [mgmtTglDiverifikasi, setMgmtTglDiverifikasi] = useState('')
  const [mgmtTglDijadwalkan, setMgmtTglDijadwalkan] = useState('')
  const [mgmtTglDiproses, setMgmtTglDiproses] = useState('')
  const [mgmtTglSelesai, setMgmtTglSelesai] = useState('')
  
  // File upload states
  const [fileSebelum, setFileSebelum] = useState<File | null>(null)
  const [fileProses, setFileProses] = useState<File | null>(null)
  const [fileSelesai, setFileSelesai] = useState<File | null>(null)

  // Preview file urls
  const [previewSebelum, setPreviewSebelum] = useState('')
  const [previewProses, setPreviewProses] = useState('')
  const [previewSelesai, setPreviewSelesai] = useState('')

  // Lightbox states
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Admin access validation check
    const stored = localStorage.getItem('user')
    if (!stored) {
      navigate('/admin')
      return
    }

    try {
      const user = JSON.parse(stored)
      const email = user.email.toLowerCase()
      const isAdmin = email.includes('admin') || email.endsWith('@dputr.go.id') || email === 'dputrbandung'

      if (!isAdmin) {
        alert('Akses ditolak. Halaman ini khusus untuk admin DPUTR.')
        navigate('/progres')
        return
      }
    } catch (err) {
      navigate('/admin')
      return
    }

    fetchReports()
  }, [navigate])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await api.get('/reports')
      setReports(res.data.reports)
    } catch {
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const openManagementDrawer = (report: Report) => {
    setSelectedReport(report)
    setMgmtStatus(report.status)
    setMgmtEstimasi(report.estimasiSelesai ? report.estimasiSelesai.split('T')[0] : '')
    setMgmtTglDiverifikasi(report.tglDiverifikasi ? report.tglDiverifikasi.split('T')[0] : '')
    setMgmtTglDijadwalkan(report.tglDijadwalkan ? report.tglDijadwalkan.split('T')[0] : '')
    setMgmtTglDiproses(report.tglDiproses ? report.tglDiproses.split('T')[0] : '')
    setMgmtTglSelesai(report.tglSelesai ? report.tglSelesai.split('T')[0] : '')

    // Set existing image URLs as previews
    setPreviewSebelum(report.fotoSebelum || '')
    setPreviewProses(report.fotoProses || '')
    setPreviewSelesai(report.fotoSelesai || '')

    // Reset selected files
    setFileSebelum(null)
    setFileProses(null)
    setFileSelesai(null)
  }

  const openLightbox = (report: Report) => {
    const images: string[] = []
    if (report.fotoUrl) {
      images.push(...report.fotoUrl.split(','))
    }
    if (report.fotoSebelum) images.push(report.fotoSebelum)
    if (report.fotoProses) images.push(report.fotoProses)
    if (report.fotoSelesai) images.push(report.fotoSelesai)

    if (images.length > 0) {
      setLightboxImages(images)
      setLightboxIndex(0)
      setLightboxOpen(true)
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1))
  }

  const handleStatusChange = (newStatus: string) => {
    setMgmtStatus(newStatus)
    const today = new Date().toISOString().split('T')[0]

    // Auto-fill dates based on status logic
    if (newStatus !== 'terkirim_pending' && newStatus !== 'gagal_terkirim' && !mgmtTglDiverifikasi) {
      setMgmtTglDiverifikasi(today)
    }
    if ((newStatus === 'terkirim_in_progress' || newStatus === 'terkirim_solved') && !mgmtTglDijadwalkan) {
      setMgmtTglDijadwalkan(today)
    }
    if ((newStatus === 'terkirim_in_progress' || newStatus === 'terkirim_solved') && !mgmtTglDiproses) {
      setMgmtTglDiproses(today)
    }
    if (newStatus === 'terkirim_solved' && !mgmtTglSelesai) {
      setMgmtTglSelesai(today)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'sebelum' | 'proses' | 'selesai') => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    if (type === 'sebelum') {
      setFileSebelum(file)
      setPreviewSebelum(previewUrl)
    } else if (type === 'proses') {
      setFileProses(file)
      setPreviewProses(previewUrl)
    } else if (type === 'selesai') {
      setFileSelesai(file)
      setPreviewSelesai(previewUrl)
    }
  }

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReport) return

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('status', mgmtStatus)
      if (mgmtEstimasi) formData.append('estimasiSelesai', new Date(mgmtEstimasi).toISOString())
      if (mgmtTglDiverifikasi) formData.append('tglDiverifikasi', new Date(mgmtTglDiverifikasi).toISOString())
      if (mgmtTglDijadwalkan) formData.append('tglDijadwalkan', new Date(mgmtTglDijadwalkan).toISOString())
      if (mgmtTglDiproses) formData.append('tglDiproses', new Date(mgmtTglDiproses).toISOString())
      if (mgmtTglSelesai) formData.append('tglSelesai', new Date(mgmtTglSelesai).toISOString())

      if (fileSebelum) formData.append('fotoSebelum', fileSebelum)
      if (fileProses) formData.append('fotoProses', fileProses)
      if (fileSelesai) formData.append('fotoSelesai', fileSelesai)

      await api.patch(`/reports/${selectedReport.id}/admin-update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      showToast({ type: 'success', title: 'Berhasil Disimpan!', message: 'Progres penanganan laporan telah diperbarui.' })
      setSelectedReport(null)
      fetchReports()
    } catch (err) {
      console.error(err)
      showToast({ type: 'error', title: 'Gagal Menyimpan', message: 'Terjadi kesalahan saat memperbarui data penanganan.' })
    } finally {
      setSaving(false)
    }
  }

  // Get unique areas for filter
  const areas = Array.from(new Set(reports.map(r => r.area).filter(Boolean))) as string[]

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      (r.namaJalan?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (r.jenisKerusakan?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (r.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) || false)

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesArea = areaFilter === 'all' || r.area === areaFilter

    return matchesSearch && matchesStatus && matchesArea
  })

  // Status counts for sidebar
  const pendingCount = reports.filter(r => r.status === 'terkirim_pending').length
  const inProgressCount = reports.filter(r => r.status === 'terkirim_in_progress').length
  const solvedCount = reports.filter(r => r.status === 'terkirim_solved').length

  // Area priority — top 3 areas with most active reports (non-solved)
  const activeReports = reports.filter(r => r.status !== 'terkirim_solved' && r.status !== 'terkirim_rejected')
  const areaPriority = Object.entries(
    activeReports.reduce((acc: Record<string, number>, r) => {
      const area = r.area || 'Lainnya'
      acc[area] = (acc[area] || 0) + 1
      return acc
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  const getPriorityLevel = (count: number) => {
    if (count >= 4) return { label: 'TINGGI', color: 'text-red-500 border-red-500/40 bg-transparent' }
    if (count >= 2) return { label: 'MEDIUM', color: 'text-amber-500 border-amber-500/40 bg-transparent' }
    return { label: 'RENDAH', color: 'text-sky-500 border-sky-500/40 bg-transparent' }
  }

  return (
    <div className="min-h-screen flex bg-[#0d1117] text-slate-300 font-sans">
      
      {/* Sidebar Layout */}
      <aside className="w-56 border-r border-slate-800 bg-[#0d1117] flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="p-5 pb-8 border-b border-slate-800/60 mb-4">
             <div className="flex flex-col">
              <span className="font-heading font-extrabold text-white text-lg tracking-tight">monitoring</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active Monitoring</span>
            </div>
          </div>

          <nav className="space-y-1 px-3">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sky-400 rounded-r" />
              <Link to="/admin/lapor"
                className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-white bg-white/5">
                <FileText size={16} /> Reports
              </Link>
            </div>
            <Link to="/admin/analytics"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-slate-400 hover:text-white">
              <BarChart3 size={16} /> Analytics
            </Link>
          </nav>
        </div>

        <div className="p-4 space-y-2">
          <Link to="/" className="flex items-center gap-2 py-2 px-3 hover:bg-white/5 text-slate-400 hover:text-white text-[11px] font-bold rounded-lg transition-all">
            <Globe size={14} /> Public View
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 py-2 px-3 hover:bg-white/5 text-slate-400 hover:text-red-400 text-[11px] font-bold rounded-lg transition-all cursor-pointer">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117] overflow-y-auto h-screen">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-[#0d1117] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-white">Manajemen Laporan Publik</h2>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/admin/lapor" className="p-2 bg-sky-600 rounded-lg text-white"><FileText size={16} /></Link>
            <Link to="/admin/analytics" className="p-2 hover:bg-white/5 rounded-lg text-slate-400"><BarChart3 size={16} /></Link>
            <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-lg text-red-400"><LogOut size={16} /></button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 w-full mx-auto">
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

            {/* ═══ LEFT: Report Cards ═══ */}
            <div className="xl:col-span-3 space-y-5">

              {/* Subtitle + Search/Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[#161b22] p-4 rounded-xl border border-slate-800 shadow-sm">
                <p className="text-[13px] text-slate-400 max-w-sm">
                  Pantau dan kelola insiden infrastruktur jalan secara real-time.
                </p>
                
                {/* Search & Filters */}
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Cari laporan..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full md:w-56 pl-9 pr-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-[12px] text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500 transition-all"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="bg-[#0d1117] border border-slate-700 px-3 py-2 rounded-lg text-[12px] font-semibold text-slate-300 outline-none focus:border-sky-500 transition-colors"
                    >
                      <option value="all">Semua Status</option>
                      <option value="terkirim_pending">Tertunda</option>
                      <option value="terkirim_in_progress">Diproses</option>
                      <option value="terkirim_solved">Selesai</option>
                      <option value="terkirim_rejected">Ditolak</option>
                    </select>
                    <select
                      value={areaFilter}
                      onChange={e => setAreaFilter(e.target.value)}
                      className="bg-[#0d1117] border border-slate-700 px-3 py-2 rounded-lg text-[12px] font-semibold text-slate-300 outline-none focus:border-sky-500 transition-colors"
                    >
                      <option value="all">Semua Area</option>
                      {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Report Cards */}
              {loading ? (
                <div className="p-16 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-400 text-xs font-medium animate-pulse">Sinkronisasi data laporan...</p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="p-16 text-center bg-[#161b22] border border-slate-800 rounded-xl">
                  <div className="w-14 h-14 bg-[#0d1117] border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert size={24} className="text-slate-500" />
                  </div>
                  <h4 className="text-[15px] font-bold text-white mb-1">Laporan Tidak Ditemukan</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Belum ada laporan yang sesuai dengan pencarian atau filter Anda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => {
                    const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.terkirim_pending

                    return (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors group shadow-sm"
                      >
                        <div className="flex flex-col">
                          {/* Photo */}
                          <div 
                            className="w-full h-56 shrink-0 bg-[#0d1117] relative overflow-hidden cursor-pointer group"
                            onClick={() => openLightbox(report)}
                          >
                            <img src={report.fotoUrl ? report.fotoUrl.split(',')[0] : ''} alt="Laporan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                            {/* Overlay icon to indicate gallery */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                               <div className="bg-black/50 text-white px-3 py-1.5 rounded-lg backdrop-blur-md text-xs font-bold shadow-xl border border-white/10">
                                 Lihat Foto
                               </div>
                            </div>
                            {/* Status Badge overlay */}
                            <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold backdrop-blur-md ${status.bgColor} ${status.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                              {status.label}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                            <div>
                              <h3 className="text-[15px] font-bold text-white mb-1 truncate">{report.namaJalan || 'Lokasi Tidak Diketahui'}</h3>
                              
                              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-[11px]">
                                <span className="flex items-center gap-1 text-slate-400">
                                  <MapPin size={12} className="text-sky-500" /> {report.area || 'Area tidak tercatat'}
                                </span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Calendar size={12} className="text-slate-500" />
                                  {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <User size={12} className="text-slate-500" /> {report.user?.nama || 'Anonim'}
                                </span>
                              </div>

                              {report.jenisKerusakan && (
                                <span className="inline-block mt-3 px-2.5 py-0.5 rounded border border-slate-700 text-[10px] font-semibold text-slate-300 capitalize bg-white/5">
                                  {report.jenisKerusakan}
                                </span>
                              )}

                              {report.deskripsi && (
                                <p className="mt-3 text-[12px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {report.deskripsi}
                                </p>
                              )}
                            </div>

                            {/* Action */}
                            <div className="flex items-center gap-2 mt-4">
                              <button
                                onClick={() => openManagementDrawer(report)}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-bold transition-all cursor-pointer shadow-sm shadow-emerald-900/20 active:scale-95"
                              >
                                Kelola Penanganan <ChevronRight size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ═══ RIGHT: Sidebar Summary ═══ */}
            <div className="xl:col-span-1 space-y-5">

              {/* Ringkasan Status */}
              <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Ringkasan Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-300">Tertunda</span>
                    <span className="text-lg font-bold text-amber-500">{String(pendingCount).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-300">Sedang Diproses</span>
                    <span className="text-lg font-bold text-sky-400">{String(inProgressCount).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-300">Selesai</span>
                    <span className="text-lg font-bold text-emerald-500">{String(solvedCount).padStart(2, '0')}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden flex mt-2">
                    {reports.length > 0 && (
                      <>
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(solvedCount / reports.length) * 100}%` }} />
                        <div className="h-full bg-sky-500 transition-all" style={{ width: `${(inProgressCount / reports.length) * 100}%` }} />
                        <div className="h-full bg-amber-500 transition-all" style={{ width: `${(pendingCount / reports.length) * 100}%` }} />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Area Prioritas */}
              <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Area Prioritas</h3>
                {areaPriority.length === 0 ? (
                  <p className="text-[11px] text-slate-500">Semua area terkendali.</p>
                ) : (
                  <div className="space-y-2.5">
                    {areaPriority.map((item, idx) => {
                      const priority = getPriorityLevel(item.count)
                      return (
                        <div key={idx} className="bg-[#0d1117] border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-200 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.count} laporan aktif</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded border text-[10px] font-bold shrink-0 ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Admin Management Overlay Drawer */}
      <AnimatePresence>
        {selectedReport && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#161b22] border-l border-slate-800 shadow-2xl z-50 overflow-y-auto flex flex-col text-slate-300"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0d1117]">
                <div>
                  <h3 className="text-[15px] font-bold text-white">Kelola Penanganan Laporan</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Update status pengerjaan, dokumentasi, dan jadwal penanganan.</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 bg-[#161b22] hover:bg-white/5 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content */}
              <form onSubmit={handleSaveUpdate} className="p-6 space-y-6 flex-1">
                
                {/* Status Dropdown */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Status Penanganan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={mgmtStatus}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="w-full text-[13px] p-2.5 bg-[#0d1117] border border-slate-700 rounded-lg outline-none focus:border-sky-500 transition-colors text-slate-200 font-semibold"
                  >
                    <option value="terkirim_pending">Terkirim - Pending</option>
                    <option value="terkirim_in_progress">Terkirim - In-Progress</option>
                    <option value="terkirim_solved">Terkirim - Solved</option>
                    <option value="terkirim_rejected">Terkirim - Rejected</option>
                    <option value="gagal_terkirim">Gagal Terkirim</option>
                  </select>
                </div>

                {/* Estimasi Selesai */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Estimasi Selesai
                  </label>
                  <input
                    type="date"
                    value={mgmtEstimasi}
                    onChange={e => setMgmtEstimasi(e.target.value)}
                    className="w-full text-[13px] p-2.5 bg-[#0d1117] border border-slate-700 rounded-lg outline-none focus:border-sky-500 text-slate-200"
                  />
                </div>

                {/* Timeline Dates Milestones */}
                <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-slate-800">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Timeline Progres (Milestone Dates)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* tglDiverifikasi */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">1. Tanggal Diverifikasi</label>
                      <input
                        type="date"
                        value={mgmtTglDiverifikasi}
                        onChange={e => setMgmtTglDiverifikasi(e.target.value)}
                        className="w-full text-[12px] p-2 bg-[#161b22] border border-slate-700 rounded-lg outline-none focus:border-sky-500 text-slate-300"
                      />
                    </div>

                    {/* tglDijadwalkan */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">2. Tanggal Dijadwalkan</label>
                      <input
                        type="date"
                        value={mgmtTglDijadwalkan}
                        onChange={e => setMgmtTglDijadwalkan(e.target.value)}
                        className="w-full text-[12px] p-2 bg-[#161b22] border border-slate-700 rounded-lg outline-none focus:border-sky-500 text-slate-300"
                      />
                    </div>

                    {/* tglDiproses */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">3. Tanggal Mulai Diproses</label>
                      <input
                        type="date"
                        value={mgmtTglDiproses}
                        onChange={e => setMgmtTglDiproses(e.target.value)}
                        className="w-full text-[12px] p-2 bg-[#161b22] border border-slate-700 rounded-lg outline-none focus:border-sky-500 text-slate-300"
                      />
                    </div>

                    {/* tglSelesai */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">4. Tanggal Selesai Perbaikan</label>
                      <input
                        type="date"
                        value={mgmtTglSelesai}
                        onChange={e => setMgmtTglSelesai(e.target.value)}
                        className="w-full text-[12px] p-2 bg-[#161b22] border border-slate-700 rounded-lg outline-none focus:border-sky-500 text-slate-300"
                      />
                    </div>

                  </div>
                </div>

                {/* Upload Foto Penanganan */}
                <div className="space-y-4">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Dokumentasi Pengerjaan DPUTR
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Foto Sebelum */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500">1. Sebelum Perbaikan</label>
                      <div className="flex-1 aspect-[4/3] rounded-lg border border-dashed border-slate-700 bg-[#0d1117] overflow-hidden relative flex items-center justify-center text-center p-2 group hover:border-sky-500/50 transition-colors">
                        {previewSebelum ? (
                          <>
                            <img src={previewSebelum} alt="Sebelum" className="absolute inset-0 w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => { setFileSebelum(null); setPreviewSebelum(''); }}
                              className="absolute top-1 right-1 p-1 bg-red-900/80 hover:bg-red-800 text-white rounded cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </>
                        ) : (
                          <label className="cursor-pointer space-y-1 py-4 block w-full text-center">
                            <Upload size={16} className="mx-auto text-slate-500" />
                            <span className="text-[9px] text-slate-400 font-bold block">Unggah Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileChange(e, 'sebelum')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Foto Proses */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500">2. Proses Perbaikan</label>
                      <div className="flex-1 aspect-[4/3] rounded-lg border border-dashed border-slate-700 bg-[#0d1117] overflow-hidden relative flex items-center justify-center text-center p-2 group hover:border-sky-500/50 transition-colors">
                        {previewProses ? (
                          <>
                            <img src={previewProses} alt="Proses" className="absolute inset-0 w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => { setFileProses(null); setPreviewProses(''); }}
                              className="absolute top-1 right-1 p-1 bg-red-900/80 hover:bg-red-800 text-white rounded cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </>
                        ) : (
                          <label className="cursor-pointer space-y-1 py-4 block w-full text-center">
                            <Upload size={16} className="mx-auto text-slate-500" />
                            <span className="text-[9px] text-slate-400 font-bold block">Unggah Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileChange(e, 'proses')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Foto Selesai */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500">3. Hasil Akhir</label>
                      <div className="flex-1 aspect-[4/3] rounded-lg border border-dashed border-slate-700 bg-[#0d1117] overflow-hidden relative flex items-center justify-center text-center p-2 group hover:border-sky-500/50 transition-colors">
                        {previewSelesai ? (
                          <>
                            <img src={previewSelesai} alt="Selesai" className="absolute inset-0 w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => { setFileSelesai(null); setPreviewSelesai(''); }}
                              className="absolute top-1 right-1 p-1 bg-red-900/80 hover:bg-red-800 text-white rounded cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </>
                        ) : (
                          <label className="cursor-pointer space-y-1 py-4 block w-full text-center">
                            <Upload size={16} className="mx-auto text-slate-500" />
                            <span className="text-[9px] text-slate-400 font-bold block">Unggah Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileChange(e, 'selesai')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Submit Controls */}
                <div className="pt-4 border-t border-slate-800 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    className="flex-1 py-2.5 border border-slate-700 hover:bg-white/5 text-slate-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[101]"
            >
              <X size={24} />
            </button>

            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 md:left-12 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-[101] border border-white/10"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 md:right-12 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-[101] border border-white/10"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div 
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={lightboxImages[lightboxIndex]} 
                alt="Dokumentasi Laporan" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
              />
              
              {/* Indicator dots */}
              {lightboxImages.length > 1 && (
                <div className="absolute -bottom-10 flex gap-2">
                  {lightboxImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full transition-all ${idx === lightboxIndex ? 'bg-white scale-125' : 'bg-white/40'}`} 
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}
