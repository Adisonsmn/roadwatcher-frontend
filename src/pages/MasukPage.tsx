import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle, Zap, Shield, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

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
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi')
      return
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid')
      return
    }

    // Validasi password
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter')
      return
    }
    if (!/[a-z]/.test(password)) {
      setError('Kata sandi harus mengandung huruf kecil')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError('Kata sandi harus mengandung huruf kapital')
      return
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      setError('Kata sandi harus mengandung simbol (contoh: !@#$%)')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      // Simpan token dan data user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      // Redirect ke beranda
      navigate('/')
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Terjadi kesalahan, coba lagi'
      setError(msg)
    } finally {
      setLoading(false)
    }
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
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 transition-all ${email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-navy-200 focus:ring-teal-400/50 focus:border-teal-400'}`} />
                  </div>
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <p className="text-xs text-red-500 mt-1">Format email tidak valid</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Kata Sandi</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 transition-all ${password && (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-navy-200 focus:ring-teal-400/50 focus:border-teal-400'}`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) && (
                    <p className="text-xs text-red-500 mt-1">Min 8 karakter, huruf kecil, kapital, dan simbol</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded border-navy-300 text-teal-500 focus:ring-teal-400" />
                    <span className="text-sm text-navy-600">Ingat saya</span>
                  </label>
                  <a href="#" className="text-sm font-semibold text-teal-600 hover:text-teal-700">Lupa kata sandi?</a>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-teal-600/20 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Masuk ke Akun <ArrowRight size={16} /></>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <X size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

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
