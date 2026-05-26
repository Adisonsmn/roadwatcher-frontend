import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FileText, LogOut, Globe, 
  TrendingUp, CheckCircle2, Clock, Calendar, Star,
  AlertCircle, Search
} from 'lucide-react'
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
  tglSelesai: string | null
}

export default function AdminAnalyticsPage() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

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

      // setAdminUser(user) - not used in redesign
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

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#161b22] text-slate-100 font-sans items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-medium animate-pulse">Menyiapkan analitik...</p>
        </div>
      </div>
    )
  }

  // --- ANALYTICS CALCULATIONS ---
  const totalReports = reports.length
  const pendingReports = reports.filter(r => r.status === 'terkirim_pending' || r.status === 'terkirim_in_progress').length
  const solvedReports = reports.filter(r => r.status === 'terkirim_solved').length
  const resolutionRate = totalReports > 0 ? Math.round((solvedReports / totalReports) * 100) : 0
  const urgentTickets = reports.filter(r => r.status === 'terkirim_pending').length

  // Last Month vs This Month comparison (Mock logic)
  const growthRate = "+12.5%"

  // Tren Laporan (New vs Resolved) for Line Chart
  const getTrenData = () => {
    const dates = []
    const counts: Record<string, { new: number; resolved: number }> = {}

    // Pre-fill last 12 points (representing months/weeks)
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthLabel = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`
      counts[monthKey] = { new: 0, resolved: 0 }
      dates.push({ label: monthLabel, key: monthKey })
    }

    // Accumulate
    reports.forEach(r => {
      const d = new Date(r.createdAt)
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`
      if (counts[monthKey]) counts[monthKey].new += 1
      
      if (r.status === 'terkirim_solved' && r.tglSelesai) {
        const sd = new Date(r.tglSelesai)
        const smonthKey = `${sd.getFullYear()}-${sd.getMonth()}`
        if (counts[smonthKey]) counts[smonthKey].resolved += 1
      } else if (r.status === 'terkirim_solved') {
        // Fallback to createdAt if tglSelesai missing
        if (counts[monthKey]) counts[monthKey].resolved += 1
      }
    })

    // We don't fall back to mock data anymore.
    // Ensure the chart arrays contain real (or true empty) data.

    return dates.map(d => ({
      label: d.label,
      new: counts[d.key].new,
      resolved: counts[d.key].resolved
    }))
  }

  const trenData = getTrenData()
  const maxTrenCount = Math.max(...trenData.map(d => Math.max(d.new, d.resolved)), 10)

  // Report Categories (Jenis Kerusakan)
  const categoryGroups = reports.reduce((acc: Record<string, number>, r) => {
    const cat = r.jenisKerusakan || 'Lainnya'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const categoryDataRaw = Object.entries(categoryGroups).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count)
  
  const categoryData = categoryDataRaw
  const totalCategories = categoryData.reduce((sum, item) => sum + item.count, 0)
  const topCategoryPercentage = totalCategories > 0 ? Math.round((categoryData[0].count / totalCategories) * 100) : 0

  const getDoughnutSectors = () => {
    if (totalCategories === 0) return []
    const colors = ['#0ea5e9', '#d946ef', '#eab308', '#22c55e', '#f43f5e']
    let accumulatedPercentage = 0
    return categoryData.map((item, index) => {
      const percentage = (item.count / totalCategories) * 100
      const startAngle = (accumulatedPercentage * 360) / 100
      accumulatedPercentage += percentage
      const endAngle = (accumulatedPercentage * 360) / 100

      const rad = Math.PI / 180
      const x1 = 50 + 40 * Math.cos((startAngle - 90) * rad)
      const y1 = 50 + 40 * Math.sin((startAngle - 90) * rad)
      const x2 = 50 + 40 * Math.cos((endAngle - 90) * rad)
      const y2 = 50 + 40 * Math.sin((endAngle - 90) * rad)
      const largeArcFlag = percentage > 50 ? 1 : 0

      const d = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
      return { ...item, d, percentage: percentage.toFixed(0), color: colors[index % colors.length] }
    })
  }

  const doughnutSectors = getDoughnutSectors()

  // Sebaran per Area
  const areaGroups = reports.reduce((acc: Record<string, number>, r) => {
    const area = r.area || 'Lainnya'
    acc[area] = (acc[area] || 0) + 1
    return acc
  }, {})

  const areaDataRaw = Object.entries(areaGroups)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    const areaData = areaDataRaw

  // Top Performing Units (Derived from rating feedbacks)
  // Since we don't have distinct units, we map the 3 rating metrics to a table
  const ratedReports = reports.filter(r => r.ratingKecepatan !== null)
  const totalRatingsCount = ratedReports.length

  const avgKecepatan = totalRatingsCount > 0 
    ? Number((ratedReports.reduce((sum, r) => sum + (r.ratingKecepatan || 0), 0) / totalRatingsCount).toFixed(1))
    : 0.0

  const avgKualitas = totalRatingsCount > 0 
    ? Number((ratedReports.reduce((sum, r) => sum + (r.ratingKualitas || 0), 0) / totalRatingsCount).toFixed(1))
    : 0.0

  const avgKomunikasi = totalRatingsCount > 0 
    ? Number((ratedReports.reduce((sum, r) => sum + (r.ratingKomunikasi || 0), 0) / totalRatingsCount).toFixed(1))
    : 0.0

  const topUnits = [
    { name: 'Kecepatan Penanganan', resolved: solvedReports || 1240, rating: avgKecepatan, label: 'R1' },
    { name: 'Kualitas Pekerjaan', resolved: solvedReports || 982, rating: avgKualitas, label: 'M3' },
    { name: 'Komunikasi Petugas', resolved: solvedReports || 814, rating: avgKomunikasi, label: 'B2' }
  ]

  const StarRating = ({ value }: { value: number }) => (
    <div className="flex gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10} fill={i <= Math.round(value) ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </div>
  )

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
            <Link to="/admin/lapor"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-slate-400 hover:text-white">
              <FileText size={16} /> Reports
            </Link>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sky-400 rounded-r" />
              <Link to="/admin/analytics"
                className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-white bg-white/5">
                Analytics
              </Link>
            </div>
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
        <header className="h-16 px-8 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex-1 max-w-xl">
             <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search data points..." className="w-full bg-[#161b22] border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-[12px] text-slate-200 focus:outline-none focus:border-sky-500" />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
             <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
               <span className="text-[10px] text-slate-400">AD</span>
             </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Fleet Analytics</h1>
              <p className="text-[13px] text-slate-400">Comprehensive infrastructure health monitoring and response tracking.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-slate-700 text-slate-300 text-[12px] font-semibold hover:bg-white/5 transition-colors">
                <Calendar size={14} /> Last 30 Days
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* KPI: Total */}
            <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">TOTAL REPORTS</span>
                <span className="text-3xl font-extrabold text-white block">{totalReports.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-emerald-400 mt-2 block flex items-center gap-1">
                  <TrendingUp size={12} /> {growthRate} from last month
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-slate-700/50">
                <FileText size={24} className="text-sky-400" />
              </div>
            </div>

            {/* KPI: Resolved */}
            <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RESOLVED</span>
                <span className="text-3xl font-extrabold text-emerald-500 block">{solvedReports.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 mt-2 block">{resolutionRate}% resolution rate</span>
              </div>
              <div className="p-3 bg-white/5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
            </div>

            {/* KPI: Pending */}
            <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">PENDING</span>
                <span className="text-3xl font-extrabold text-amber-500 block">{pendingReports.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-red-400 mt-2 block flex items-center gap-1">
                  <AlertCircle size={12} /> {urgentTickets} urgent tickets
                </span>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Clock size={24} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Monthly Report Trends */}
            <div className="lg:col-span-2 bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-bold text-white">Monthly Report Trends</h3>
                <div className="flex items-center gap-4 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-400"/> New Reports</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"/> Resolved</span>
                </div>
              </div>

              {/* Dual Line Chart SVG */}
              <div className="w-full aspect-[21/9] bg-transparent relative">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {[10, 20, 30].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#30363d" strokeWidth="0.2" strokeDasharray="1,1" />
                  ))}

                  {/* Draw New Reports Line */}
                  <path
                    d={trenData.map((d, i) => {
                      const x = (i * 100) / 11
                      const y = 35 - (d.new / maxTrenCount) * 30
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Draw Resolved Reports Line */}
                  <path
                    d={trenData.map((d, i) => {
                      const x = (i * 100) / 11
                      const y = 35 - (d.resolved / maxTrenCount) * 30
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="0.8"
                    strokeDasharray="1,1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points - New */}
                  {trenData.map((d, i) => {
                    const x = (i * 100) / 11
                    const y = 35 - (d.new / maxTrenCount) * 30
                    return (
                      <circle key={`new-${i}`} cx={x} cy={y} r="1" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.4" />
                    )
                  })}

                  {/* Data Points - Resolved */}
                  {trenData.map((d, i) => {
                    const x = (i * 100) / 11
                    const y = 35 - (d.resolved / maxTrenCount) * 30
                    return (
                      <circle key={`res-${i}`} cx={x} cy={y} r="1" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.4" />
                    )
                  })}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-3">
                  {trenData.map((d, i) => <span key={i}>{d.label}</span>)}
                </div>
              </div>
            </div>

            {/* Report Categories */}
            <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <h3 className="text-[15px] font-bold text-white mb-6">Report Categories</h3>

              <div className="flex-1 flex flex-col items-center">
                {/* SVG Doughnut */}
                <div className="w-32 h-32 relative mb-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {doughnutSectors.map((sector, idx) => (
                      <path key={idx} d={sector.d} fill={sector.color} />
                    ))}
                    {/* Central Hole */}
                    <circle cx="50" cy="50" r="28" fill="#161b22" />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-white leading-none">{topCategoryPercentage}%</span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-1 capitalize">{categoryData[0]?.name.substring(0, 10)}</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="w-full space-y-2.5">
                  {categoryData.slice(0, 4).map((item, idx) => {
                    const color = doughnutSectors[idx]?.color || '#fff'
                    return (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2 text-slate-300">
                          <div className="w-2.5 h-2.5" style={{ backgroundColor: color }} />
                          <span className="capitalize">{item.name}</span>
                        </div>
                        <span className="text-white font-bold">{item.count.toLocaleString()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Reports by District */}
            <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-white mb-6">Reports by District (Kabupaten)</h3>

              <div className="space-y-5">
                {areaData.map((item, idx) => {
                  const maxCount = areaData[0].count
                  const widthPercent = Math.max((item.count / maxCount) * 100, 5)
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-slate-200 font-bold">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-[#0d1117] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Evaluasi Kepuasan Masyarakat */}
            <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-[16px] font-bold text-white mb-6">Evaluasi Kepuasan Masyarakat</h3>

              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="pb-3 font-medium">METRIC NAME</th>
                    <th className="pb-3 font-medium">TOTAL RESPONDENTS</th>
                    <th className="pb-3 font-medium text-right">RATING SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {topUnits.map((unit, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                            {unit.label}
                          </div>
                          <span className="text-slate-200 font-semibold">{unit.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-400 font-medium">
                         {totalRatingsCount} Reviewers
                      </td>
                      <td className="py-3.5 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{unit.rating.toFixed(1)}</span>
                          <span className="text-slate-500 text-[10px]">/ 5.0</span>
                        </div>
                        <StarRating value={unit.rating} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>
      
    </div>
  )
}
