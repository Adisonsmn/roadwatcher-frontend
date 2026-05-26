import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, CheckCircle2, Timer, ThumbsUp } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import api from '@/lib/api'

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  sublabel,
  color,
  delay,
}: {
  icon: React.ElementType
  value: number
  suffix?: string
  label: string
  sublabel?: string
  color: string
  delay: number
}) {
  const { count, ref } = useCountUp(value, 2000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div
        className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${color}`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div className="text-3xl md:text-4xl font-heading font-extrabold text-navy-900">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs font-bold tracking-widest uppercase text-navy-500 mt-1">
        {label}
      </div>
      {sublabel && (
        <div className="text-[11px] text-navy-400 mt-0.5">{sublabel}</div>
      )}
    </motion.div>
  )
}

function MiniStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number
  suffix?: string
  label: string
  delay: number
}) {
  const { count, ref } = useCountUp(value, 2000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="text-center"
    >
      <div className="text-xl md:text-2xl font-heading font-bold text-navy-800">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-[10px] font-bold tracking-widest uppercase text-navy-400 mt-0.5">
        {label}
      </div>
    </motion.div>
  )
}

export default function StatsSection() {
  const [stats, setStats] = useState({
    laporanMasuk: 1240,
    tuntas: 85,
    dalamProses: 156,
    rataRata: '24j',
    kepuasan: '98%',
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/reports')
        const reports = res.data.reports || []
        
        if (reports.length > 0) {
          // 1. Laporan Masuk Bulan ini
          const thisMonth = new Date().getMonth()
          const thisYear = new Date().getFullYear()
          const reportsThisMonth = reports.filter((r: any) => {
            const date = new Date(r.createdAt)
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear
          }).length

          // 2. Tuntas (Solved / Total)
          const solvedReports = reports.filter((r: any) => r.status === 'terkirim_solved')
          const tuntasPercentage = Math.round((solvedReports.length / reports.length) * 100)

          // 3. Dalam Proses (In Progress)
          const dalamProses = reports.filter((r: any) => r.status === 'terkirim_in_progress').length

          // 4. Rata-Rata waktu pengerjaan
          const solvedWithTime = solvedReports.filter((r: any) => r.tglSelesai)
          let avgHours = 24
          if (solvedWithTime.length > 0) {
            let totalHours = 0
            let count = 0
            solvedWithTime.forEach((r: any) => {
              const start = new Date(r.createdAt).getTime()
              const end = new Date(r.tglSelesai).getTime()
              if (end > start) {
                totalHours += (end - start) / (1000 * 60 * 60)
                count++
              }
            })
            if (count > 0) {
              avgHours = Math.round(totalHours / count)
            }
          }
          const rataRataStr = avgHours > 0 ? `${avgHours}j` : '1j'

          // 5. Tingkat Kepuasan Ulasan
          const feedbackReports = reports.filter(
            (r: any) => r.ratingKecepatan !== null || r.ratingKualitas !== null || r.ratingKomunikasi !== null
          )
          let satisfactionPercentage = 98
          if (feedbackReports.length > 0) {
            let totalScore = 0
            let maxScore = 0
            feedbackReports.forEach((r: any) => {
              const count = (r.ratingKecepatan !== null ? 1 : 0) + 
                            (r.ratingKualitas !== null ? 1 : 0) + 
                            (r.ratingKomunikasi !== null ? 1 : 0)
              if (count > 0) {
                const sum = (r.ratingKecepatan || 0) + (r.ratingKualitas || 0) + (r.ratingKomunikasi || 0)
                totalScore += sum
                maxScore += count * 5
              }
            })
            if (maxScore > 0) {
              satisfactionPercentage = Math.round((totalScore / maxScore) * 100)
            }
          }

          setStats({
            laporanMasuk: reportsThisMonth,
            tuntas: tuntasPercentage,
            dalamProses: dalamProses,
            rataRata: rataRataStr,
            kepuasan: `${satisfactionPercentage}%`,
          })
        }
      } catch (err) {
        console.error('Failed to fetch real-time stats:', err)
      }
    }
    fetchStats()
  }, [])

  return (
    <section className="relative -mt-24 z-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-500">
            Statistik Real-Time
          </span>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl shadow-navy-900/8 border border-navy-100/50 overflow-hidden"
        >
          {/* Top stats */}
          <div className="grid grid-cols-2 divide-x divide-navy-100">
            <div className="p-6 md:p-8">
              <StatCard
                icon={ClipboardList}
                value={stats.laporanMasuk}
                label="Laporan Masuk"
                sublabel="Bulan ini"
                color="bg-navy-700"
                delay={0.1}
              />
            </div>
            <div className="p-6 md:p-8">
              <StatCard
                icon={CheckCircle2}
                value={stats.tuntas}
                suffix="%"
                label="Tuntas"
                sublabel="Tingkat penyelesaian"
                color="bg-teal-500"
                delay={0.2}
              />
            </div>
          </div>

          {/* Bottom mini stats */}
          <div className="grid grid-cols-3 divide-x divide-navy-100 border-t border-navy-100 bg-navy-50/50">
            <div className="py-4 px-3">
              <MiniStat value={stats.dalamProses} label="Dalam Proses" delay={0.3} />
            </div>
            <div className="py-4 px-3 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <Timer size={14} className="text-navy-400" />
                  <span className="text-xl md:text-2xl font-heading font-bold text-navy-800">
                    {stats.rataRata}
                  </span>
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-navy-400 mt-0.5">
                  Rata-Rata
                </div>
              </motion.div>
            </div>
            <div className="py-4 px-3 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <ThumbsUp size={14} className="text-navy-400" />
                  <span className="text-xl md:text-2xl font-heading font-bold text-navy-800">
                    {stats.kepuasan}
                  </span>
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-navy-400 mt-0.5">
                  Kepuasan
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
