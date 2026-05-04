import { motion } from 'framer-motion'
import { ClipboardList, CheckCircle2, Clock, Timer, ThumbsUp } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

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
                value={1240}
                label="Laporan Masuk"
                sublabel="Bulan ini"
                color="bg-navy-700"
                delay={0.1}
              />
            </div>
            <div className="p-6 md:p-8">
              <StatCard
                icon={CheckCircle2}
                value={85}
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
              <MiniStat value={156} label="Dalam Proses" delay={0.3} />
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
                    24j
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
                    98%
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
