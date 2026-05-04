import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'

const FEATURES = [
  { icon: CheckCircle, title: 'Tracking Real-Time', desc: 'Pantau status laporan Anda kapan saja' },
  { icon: Shield, title: 'Data Aman & Terenkripsi', desc: 'Privasi Anda adalah prioritas kami' },
  { icon: Zap, title: 'Proses Cepat', desc: 'Laporan diproses dalam hitungan menit' },
]

const STATS = [
  { value: '1.2K+', label: 'PENGGUNA AKTIF' },
  { value: '85%', label: 'TINGKAT SELESAI' },
  { value: '24/7', label: 'SUPPORT' },
]

export default function MasukPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate with API
    alert('Login berhasil! (demo)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-amber-50/20 to-navy-50">
      <Navbar forceScrolled />

      <div className="pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

          {/* Left Side — Branding */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="hidden lg:block">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center text-white font-bold text-lg">RW</div>
              <span className="font-heading font-bold text-2xl text-navy-900">ROADWATCHER</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-heading font-extrabold text-navy-900 leading-tight mb-4">
              Selamat Datang<br />Kembali!
            </h2>
            <p className="text-navy-500 text-base mb-8">Lanjutkan berkontribusi untuk infrastruktur jalan yang lebih baik</p>

            <div className="space-y-3 mb-10">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-navy-100">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <f.icon size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">{f.title}</p>
                    <p className="text-navy-400 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-heading font-extrabold text-navy-900">{s.value}</p>
                  <p className="text-[10px] font-semibold text-navy-400 tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side — Form Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="bg-white rounded-3xl shadow-2xl shadow-navy-900/8 overflow-hidden max-w-md mx-auto lg:max-w-none">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 px-8 py-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/20 flex items-center justify-center mb-4">
                  <Lock size={24} className="text-teal-300" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-white mb-1">Masuk</h1>
                <p className="text-navy-300 text-sm">Selamat datang kembali! Silakan masuk ke akun Anda</p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Alamat Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Kata Sandi</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded border-navy-300 text-teal-500 focus:ring-teal-400" />
                    <span className="text-sm text-navy-600">Ingat saya</span>
                  </label>
                  <a href="#" className="text-sm font-semibold text-teal-600 hover:text-teal-700">Lupa kata sandi?</a>
                </div>

                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-teal-600/20 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all cursor-pointer">
                  Masuk ke Akun <ArrowRight size={16} />
                </button>

                <div className="relative flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-navy-100" />
                  <span className="text-[11px] font-semibold text-navy-400 tracking-widest">ATAU LANJUTKAN DENGAN</span>
                  <div className="flex-1 h-px bg-navy-100" />
                </div>

                <button type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-navy-200 text-navy-700 font-semibold text-sm hover:bg-navy-50 transition-colors cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Masuk dengan Google
                </button>

                <p className="text-center text-sm text-navy-500 pt-2">
                  Belum punya akun?{' '}
                  <Link to="/daftar" className="font-semibold text-teal-600 hover:text-teal-700">
                    Daftar Sekarang <ArrowRight size={12} className="inline" />
                  </Link>
                </p>
              </form>
            </div>

            <p className="text-center text-xs text-navy-400 mt-4">
              Dengan masuk, Anda menyetujui{' '}
              <a href="#" className="text-teal-600 hover:underline">Syarat & Ketentuan</a> serta{' '}
              <a href="#" className="text-teal-600 hover:underline">Kebijakan Privasi</a> kami.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
