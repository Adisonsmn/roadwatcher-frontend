import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Calendar, MapPin, CheckCircle2, Clock, 
  XCircle, Camera, Check, Star, AlertCircle, MessageSquare, ShieldCheck
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
  gagal_terkirim: { label: 'Gagal Terkirim', color: 'text-red-700 border-red-200', bgColor: 'bg-red-50', icon: XCircle },
  terkirim_pending: { label: 'Terkirim - Pending', color: 'text-amber-700 border-amber-200', bgColor: 'bg-amber-50', icon: Clock },
  terkirim_in_progress: { label: 'Terkirim - In-Progress', color: 'text-blue-700 border-blue-200', bgColor: 'bg-blue-50', icon: Clock },
  terkirim_rejected: { label: 'Terkirim - Rejected', color: 'text-gray-700 border-gray-300', bgColor: 'bg-gray-100', icon: XCircle },
  terkirim_solved: { label: 'Terkirim - Solved', color: 'text-green-700 border-green-200', bgColor: 'bg-green-50', icon: CheckCircle2 },
}

const SATISFACTION_OPTIONS = [
  { label: 'Sangat Tidak Puas', value: 'sangat_tidak_puas', color: 'hover:bg-red-50 hover:text-red-600 border-red-100 text-red-500 bg-red-50/10' },
  { label: 'Tidak Puas', value: 'tidak_puas', color: 'hover:bg-orange-50 hover:text-orange-600 border-orange-100 text-orange-500 bg-orange-50/10' },
  { label: 'Cukup Puas', value: 'cukup_puas', color: 'hover:bg-yellow-50 hover:text-yellow-600 border-yellow-100 text-yellow-500 bg-yellow-50/10' },
  { label: 'Puas', value: 'puas', color: 'hover:bg-teal-50 hover:text-teal-600 border-teal-100 text-teal-500 bg-teal-50/10' },
  { label: 'Sangat Puas', value: 'sangat_puas', color: 'hover:bg-green-50 hover:text-green-600 border-green-100 text-green-500 bg-green-50/10' }
]

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatDateOnly(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Feedback states
  const [ratingKecepatan, setRatingKecepatan] = useState(0)
  const [ratingKualitas, setRatingKualitas] = useState(0)
  const [ratingKomunikasi, setRatingKomunikasi] = useState(0)
  const [jalanLayak, setJalanLayak] = useState<boolean | null>(null)
  const [kepuasan, setKepuasan] = useState('')
  const [kritikSaran, setKritikSaran] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetchReportDetails()
  }, [id])

  const fetchReportDetails = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/reports/${id}`)
      setReport(res.data.report)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || 'Gagal memuat detail laporan')
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ratingKecepatan || !ratingKualitas || !ratingKomunikasi || jalanLayak === null || !kepuasan) {
      showToast({ type: 'warning', title: 'Form Belum Lengkap', message: 'Mohon lengkapi semua kuesioner sebelum mengirim feedback.' })
      return
    }

    try {
      setSubmittingFeedback(true)
      await api.patch(`/reports/${id}/feedback`, {
        ratingKecepatan,
        ratingKualitas,
        ratingKomunikasi,
        jalanLayak,
        kepuasan,
        kritikSaran
      })
      setFeedbackSuccess(true)
      showToast({ type: 'success', title: 'Terima Kasih!', message: 'Feedback Anda sangat berharga bagi peningkatan layanan DPUTR.' })
      
      // Redirect to home after showing toast
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err: any) {
      console.error(err)
      showToast({ type: 'error', title: 'Gagal Mengirim', message: err.response?.data?.error || 'Gagal mengirim feedback. Coba lagi.' })
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-50">
        <Navbar forceScrolled />
        <main className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-navy-600 text-sm font-semibold animate-pulse">Memuat detail progres...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-50">
        <Navbar forceScrolled />
        <main className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center max-w-md w-full">
            <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-heading font-bold text-navy-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-navy-500 text-sm mb-6">{error || 'Laporan tidak ditemukan.'}</p>
            <Link to="/progres"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-800 text-white font-semibold text-sm rounded-xl shadow-lg hover:from-navy-800 hover:to-navy-900 transition-all">
              <ArrowLeft size={16} /> Kembali ke Progres
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusInfo = STATUS_CONFIG[report.status] || STATUS_CONFIG.terkirim_pending
  const StatusIcon = statusInfo.icon

  // Build timeline steps
  const steps = [
    { 
      title: 'Laporan Diterima', 
      desc: 'Laporan Anda telah berhasil masuk ke sistem DPUTR Kab.',
      done: true, 
      date: report.tglDiterima || report.createdAt 
    },
    { 
      title: 'Verifikasi Petugas', 
      desc: 'Petugas sedang meninjau dan memverifikasi detail lokasi serta kerusakan.',
      done: report.status !== 'terkirim_pending' && report.status !== 'gagal_terkirim', 
      date: report.tglDiverifikasi 
    },
    { 
      title: 'Perbaikan Dijadwalkan', 
      desc: 'Kerusakan terverifikasi dan masuk dalam jadwal pengerjaan DPUTR.',
      done: report.status === 'terkirim_in_progress' || report.status === 'terkirim_solved', 
      date: report.tglDijadwalkan 
    },
    { 
      title: 'Perbaikan Dilakukan', 
      desc: 'Petugas teknis di lapangan sedang melakukan proses pengerjaan jalan.',
      done: report.status === 'terkirim_solved' || (report.status === 'terkirim_in_progress' && report.tglDiproses !== null), 
      date: report.tglDiproses 
    },
    { 
      title: 'Laporan Selesai', 
      desc: 'Pekerjaan perbaikan jalan telah selesai dilakukan oleh tim DPUTR.',
      done: report.status === 'terkirim_solved', 
      date: report.tglSelesai 
    }
  ]

  const StarRating = ({ value, onChange, disabled }: { value: number; onChange?: (val: number) => void; disabled?: boolean }) => {
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= value
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(star)}
              className={`transition-all duration-200 ${!disabled ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'} ${
                isFilled ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              <Star size={24} fill={isFilled ? 'currentColor' : 'none'} className="stroke-[1.5]" />
            </button>
          )
        })}
      </div>
    )
  }

  const getKepuasanLabel = (val: string) => {
    const opt = SATISFACTION_OPTIONS.find(o => o.value === val)
    return opt ? opt.label : val
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar forceScrolled />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link to="/progres" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-800 transition-colors mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Status Laporan
          </Link>

          {/* Header Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Main Info Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-navy-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusInfo.bgColor} ${statusInfo.color}`}>
                    <StatusIcon size={14} /> {statusInfo.label}
                  </div>
                </div>

                <h1 className="text-xl md:text-2xl font-heading font-extrabold text-navy-900 mb-2">
                  {report.namaJalan || 'Kerusakan Jalan'}
                </h1>
                <p className="text-sm text-navy-500 flex items-center gap-1 mb-4">
                  <MapPin size={14} className="text-navy-400" /> {report.area || 'Jawa Barat, Indonesia'}
                </p>

                <div className="space-y-3 bg-navy-50/50 p-4 rounded-xl border border-navy-100/50">
                  <div className="flex gap-2 text-xs">
                    <span className="font-semibold text-navy-700 w-24 shrink-0">Kategori:</span>
                    <span className="text-navy-600">{report.jenisKerusakan || 'Tidak dispesifikasi'}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="font-semibold text-navy-700 w-24 shrink-0">Deskripsi:</span>
                    <span className="text-navy-600 whitespace-pre-line leading-relaxed">{report.deskripsi || 'Tidak ada deskripsi.'}</span>
                  </div>
                  <div className="flex gap-2 text-xs border-t border-navy-100/60 pt-2">
                    <span className="font-semibold text-navy-700 w-24 shrink-0">Dilaporkan:</span>
                    <span className="text-navy-600 flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(report.createdAt)}
                    </span>
                  </div>
                  {report.estimasiSelesai && (
                    <div className="flex gap-2 text-xs border-t border-navy-100/60 pt-2">
                      <span className="font-semibold text-teal-700 w-24 shrink-0">Estimasi Selesai:</span>
                      <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        {formatDateOnly(report.estimasiSelesai)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Original Image Card */}
            <div className="bg-white rounded-2xl border border-navy-100 shadow-sm p-4 flex flex-col">
              <span className="text-xs font-bold text-navy-700 mb-2 block">Foto Laporan Masyarakat</span>
              <div className="relative h-64 md:h-80 bg-navy-100 rounded-2xl overflow-hidden shadow-sm group">
                <img 
                  src={report.fotoUrl ? report.fotoUrl.split(',')[0] : ''} 
                  alt="Lokasi Kerusakan" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>

          {/* Timeline & Documentation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Timeline Progress */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-navy-100 shadow-sm p-6">
              <h3 className="text-base font-heading font-extrabold text-navy-950 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-teal-600" /> Timeline Progres
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-navy-100">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle marker */}
                    <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-colors duration-300 ${
                      step.done 
                        ? 'bg-teal-500 border-teal-100 ring-4 ring-teal-50' 
                        : 'bg-white border-navy-200'
                    }`} />

                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${step.done ? 'text-navy-900' : 'text-navy-400'}`}>
                        {step.title}
                      </h4>
                      <p className={`text-[10px] leading-relaxed ${step.done ? 'text-navy-500' : 'text-navy-300'}`}>
                        {step.desc}
                      </p>
                      {step.done && step.date && (
                        <span className="inline-block text-[9px] font-semibold text-teal-600 bg-teal-50/50 px-2 py-0.5 rounded border border-teal-100/50 mt-1">
                          {formatDateOnly(step.date)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DPUTR Action Documentation */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-navy-100 shadow-sm p-6 flex flex-col">
              <h3 className="text-base font-heading font-extrabold text-navy-950 mb-4 flex items-center gap-2">
                <Camera size={18} className="text-teal-600" /> Dokumentasi Pengerjaan DPUTR
              </h3>
              <p className="text-xs text-navy-500 mb-6">
                Transparansi proses pengerjaan jalan dari awal penanganan hingga selesai.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                
                {/* Sebelum Perbaikan */}
                <div className="flex flex-col h-full">
                  <span className="text-[11px] font-bold text-navy-700 mb-1.5 block">1. Sebelum Perbaikan</span>
                  <div className="flex-1 aspect-[4/3] md:aspect-auto rounded-xl border border-navy-100 overflow-hidden bg-navy-50 relative flex items-center justify-center text-center p-4">
                    {report.fotoSebelum ? (
                      <img src={report.fotoSebelum} alt="Sebelum Perbaikan" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="space-y-1 text-navy-400">
                        <Camera size={20} className="mx-auto stroke-[1.5]" />
                        <span className="text-[10px] font-semibold block">Belum Diunggah</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proses Perbaikan */}
                <div className="flex flex-col h-full">
                  <span className="text-[11px] font-bold text-navy-700 mb-1.5 block">2. Proses Perbaikan</span>
                  <div className="flex-1 aspect-[4/3] md:aspect-auto rounded-xl border border-navy-100 overflow-hidden bg-navy-50 relative flex items-center justify-center text-center p-4">
                    {report.fotoProses ? (
                      <img src={report.fotoProses} alt="Proses Perbaikan" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="space-y-1 text-navy-400">
                        <Camera size={20} className="mx-auto stroke-[1.5]" />
                        <span className="text-[10px] font-semibold block">Belum Diunggah</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hasil Akhir */}
                <div className="flex flex-col h-full">
                  <span className="text-[11px] font-bold text-navy-700 mb-1.5 block">3. Hasil Akhir</span>
                  <div className="flex-1 aspect-[4/3] md:aspect-auto rounded-xl border border-navy-100 overflow-hidden bg-navy-50 relative flex items-center justify-center text-center p-4">
                    {report.fotoSelesai ? (
                      <img src={report.fotoSelesai} alt="Hasil Akhir" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="space-y-1 text-navy-400">
                        <Camera size={20} className="mx-auto stroke-[1.5]" />
                        <span className="text-[10px] font-semibold block">Belum Diunggah</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-2xl border border-navy-100 shadow-sm p-6 md:p-8">
            {report.status !== 'terkirim_solved' ? (
              // Status not Solved yet
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-navy-50 border border-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={20} className="text-navy-400" />
                </div>
                <h4 className="text-sm font-heading font-extrabold text-navy-900 mb-1">Evaluasi Pekerjaan Belum Tersedia</h4>
                <p className="text-xs text-navy-500 max-w-md mx-auto">
                  Kolom feedback dan penilaian kualitas pengerjaan DPUTR akan terbuka otomatis setelah status laporan Anda berubah menjadi <span className="font-bold text-green-600">Terkirim - Solved</span>.
                </p>
              </div>
            ) : (report.kepuasan === null && !feedbackSuccess) ? (
              // Solved, feedback not yet submitted
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="border-b border-navy-100 pb-4 mb-4">
                  <h3 className="text-lg font-heading font-extrabold text-navy-950 flex items-center gap-2">
                    <MessageSquare size={20} className="text-teal-600" /> Evaluasi & Feedback Layanan DPUTR
                  </h3>
                  <p className="text-xs text-navy-500 mt-1">
                    Masukan Anda sangat penting untuk membantu DPUTR meningkatkan kecepatan, kualitas, dan transparansi pengerjaan infrastruktur.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Rating Kecepatan */}
                  <div className="space-y-2 bg-navy-50/30 p-4 rounded-xl border border-navy-100/50">
                    <label className="block text-xs font-bold text-navy-800">
                      1. Seberapa cepat penanganan laporan dilakukan? <span className="text-red-500">*</span>
                    </label>
                    <StarRating value={ratingKecepatan} onChange={setRatingKecepatan} />
                  </div>

                  {/* Rating Kualitas */}
                  <div className="space-y-2 bg-navy-50/30 p-4 rounded-xl border border-navy-100/50">
                    <label className="block text-xs font-bold text-navy-800">
                      2. Bagaimana kualitas hasil perbaikan jalan? <span className="text-red-500">*</span>
                    </label>
                    <StarRating value={ratingKualitas} onChange={setRatingKualitas} />
                  </div>

                  {/* Kelayakan Jalan */}
                  <div className="space-y-2 bg-navy-50/30 p-4 rounded-xl border border-navy-100/50">
                    <label className="block text-xs font-bold text-navy-800">
                      3. Apakah jalan tersebut saat ini sudah layak dilalui? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setJalanLayak(true)}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                          jalanLayak === true
                            ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                            : 'bg-white border-navy-200 text-navy-600 hover:bg-navy-50'
                        }`}
                      >
                        Ya, Sudah Layak
                      </button>
                      <button
                        type="button"
                        onClick={() => setJalanLayak(false)}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                          jalanLayak === false
                            ? 'bg-red-500 border-red-500 text-white shadow-md'
                            : 'bg-white border-navy-200 text-navy-600 hover:bg-navy-50'
                        }`}
                      >
                        Tidak Layak
                      </button>
                    </div>
                  </div>

                  {/* Rating Komunikasi */}
                  <div className="space-y-2 bg-navy-50/30 p-4 rounded-xl border border-navy-100/50">
                    <label className="block text-xs font-bold text-navy-800">
                      4. Bagaimana keramahan & komunikasi petugas DPUTR? <span className="text-red-500">*</span>
                    </label>
                    <StarRating value={ratingKomunikasi} onChange={setRatingKomunikasi} />
                  </div>

                </div>

                {/* Kepuasan Secara Keseluruhan */}
                <div className="space-y-3 bg-navy-50/30 p-4 rounded-xl border border-navy-100/50">
                  <label className="block text-xs font-bold text-navy-800">
                    5. Tingkat kepuasan Anda secara keseluruhan terhadap pelayanan DPUTR? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {SATISFACTION_OPTIONS.map((opt) => {
                      const isSelected = kepuasan === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setKepuasan(opt.value)}
                          className={`py-2.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-center leading-snug flex flex-col justify-center items-center ${
                            isSelected
                              ? 'bg-teal-600 border-teal-600 text-white shadow-md scale-105'
                              : `bg-white border-navy-100 text-navy-600 ${opt.color}`
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Kritik & Saran */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-navy-800">
                    Kritik & Saran Tambahan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan masukan, kritik, atau apresiasi Anda kepada tim DPUTR Kab..."
                    value={kritikSaran}
                    onChange={(e) => setKritikSaran(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-xl border border-navy-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-navy-50/10 placeholder-navy-300 resize-none outline-none transition-colors"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-600/20 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] disabled:opacity-50 transition-all"
                  >
                    {submittingFeedback ? 'Mengirim...' : 'Kirim Feedback Layanan'}
                  </button>
                </div>
              </form>
            ) : (
              // Feedback already submitted (either fetched from database or newly submitted)
              <div className="space-y-6">
                <div className="border-b border-navy-100 pb-4 mb-2 flex items-center justify-between">
                  <h3 className="text-base font-heading font-extrabold text-navy-950 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-teal-600" /> Hasil Evaluasi Layanan (Sudah Dikirim)
                  </h3>
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Check size={11} strokeWidth={3} /> Terkirim ke DPUTR
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Kecepatan */}
                  <div className="p-4 rounded-xl border border-navy-100 bg-navy-50/10 space-y-1">
                    <span className="text-[10px] font-bold text-navy-500 block">1. Kecepatan Penanganan:</span>
                    <StarRating value={report.ratingKecepatan || ratingKecepatan} disabled />
                  </div>

                  {/* Kualitas */}
                  <div className="p-4 rounded-xl border border-navy-100 bg-navy-50/10 space-y-1">
                    <span className="text-[10px] font-bold text-navy-500 block">2. Kualitas Perbaikan:</span>
                    <StarRating value={report.ratingKualitas || ratingKualitas} disabled />
                  </div>

                  {/* Komunikasi */}
                  <div className="p-4 rounded-xl border border-navy-100 bg-navy-50/10 space-y-1">
                    <span className="text-[10px] font-bold text-navy-500 block">3. Komunikasi Petugas:</span>
                    <StarRating value={report.ratingKomunikasi || ratingKomunikasi} disabled />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Kelayakan Jalan */}
                  <div className="p-4 rounded-xl border border-navy-100 bg-navy-50/10 space-y-1">
                    <span className="text-[10px] font-bold text-navy-500 block">4. Kelayakan Jalan Saat Ini:</span>
                    <div className="pt-1">
                      {(report.jalanLayak || jalanLayak) ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-150 px-3 py-1 rounded-lg">
                          <CheckCircle2 size={12} /> Ya, Sudah Sangat Layak Dilalui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-150 px-3 py-1 rounded-lg">
                          <XCircle size={12} /> Belum Layak Dilalui
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Kepuasan Keseluruhan */}
                  <div className="p-4 rounded-xl border border-navy-100 bg-navy-50/10 space-y-1">
                    <span className="text-[10px] font-bold text-navy-500 block">5. Kepuasan Pelayanan Keseluruhan:</span>
                    <div className="pt-1">
                      <span className="inline-block text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-150 px-3 py-1 rounded-lg capitalize">
                        {getKepuasanLabel(report.kepuasan || kepuasan)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Kritik & Saran */}
                {(report.kritikSaran || kritikSaran) && (
                  <div className="p-4 rounded-xl border border-navy-100 bg-navy-50/10 space-y-2">
                    <span className="text-[10px] font-bold text-navy-500 block">Kritik & Saran Masyarakat:</span>
                    <p className="text-xs text-navy-700 bg-white p-3 rounded-lg border border-navy-100/50 whitespace-pre-line italic">
                      "{report.kritikSaran || kritikSaran}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
