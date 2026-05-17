import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, Eye, EyeOff, Phone, User, Sparkles, Target, Users, CheckCircle2, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

const FEATURES = [
  { icon: Sparkles, title: 'Gratis Selamanya', desc: 'Tidak ada biaya pendaftaran atau langganan' },
  { icon: Target, title: 'Dampak Nyata', desc: 'Laporan Anda membantu perbaikan infrastruktur' },
  { icon: Users, title: 'Komunitas Peduli', desc: 'Bergabung dengan ribuan warga peduli' },
]

export default function DaftarPage() {
  const navigate = useNavigate()
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validasi
    if (!nama || !email || !password) {
      setError('Nama, email, dan kata sandi wajib diisi')
      return
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid')
      return
    }

    // Validasi no HP (jika diisi)
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '')
      if (!/^(08|62)/.test(cleanPhone) || cleanPhone.length > 14) {
        setError('Nomor HP harus diawali 08 atau 62, maksimal 14 digit')
        return
      }
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

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', { nama, email, phone, password })
      setShowSuccess(true)
      // Redirect ke halaman masuk setelah 1 detik
      setTimeout(() => {
        navigate('/masuk')
      }, 1200)
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
              Bergabunglah<br />dengan Kami!
            </h2>
            <p className="text-navy-500 text-base mb-8">Mulai berkontribusi untuk infrastruktur jalan yang lebih baik hari ini</p>

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

            {/* Testimonial card */}
            <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">A</div>
                <div>
                  <p className="font-semibold text-white text-sm">Ahmad Rizki</p>
                  <p className="text-navy-400 text-xs">Pengguna Aktif</p>
                </div>
              </div>
              <p className="text-navy-200 text-sm italic leading-relaxed">
                "Proses pendaftaran sangat mudah dan cepat. Sekarang saya bisa melaporkan kerusakan jalan dengan praktis!"
              </p>
            </div>
          </motion.div>

          {/* Right Side — Form Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="bg-white rounded-3xl shadow-2xl shadow-navy-900/8 overflow-hidden max-w-md mx-auto lg:max-w-none">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 px-8 py-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/20 flex items-center justify-center mb-4">
                  <UserPlus size={24} className="text-teal-300" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-white mb-1">Daftar Akun</h1>
                <p className="text-navy-300 text-sm">Bergabung dan mulai melaporkan sekarang!</p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama lengkap"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 transition-all ${nama.length > 0 && nama.length < 3 ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-navy-200 focus:ring-teal-400/50 focus:border-teal-400'}`} />
                  </div>
                  {nama.length > 0 && nama.length < 3 && (
                    <p className="text-xs text-red-500 mt-1">Nama minimal 3 karakter</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contoh@email.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 transition-all ${email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-navy-200 focus:ring-teal-400/50 focus:border-teal-400'}`} />
                  </div>
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <p className="text-xs text-red-500 mt-1">Format email tidak valid</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Nomor Telepon</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" maxLength={14}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 transition-all ${phone && (!/^(08|62)/.test(phone.replace(/\D/g, '')) || phone.replace(/\D/g, '').length > 14) ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-navy-200 focus:ring-teal-400/50 focus:border-teal-400'}`} />
                  </div>
                  {phone && !/^(08|62)/.test(phone.replace(/\D/g, '')) && (
                    <p className="text-xs text-red-500 mt-1">Nomor HP harus diawali 08 atau 62</p>
                  )}
                  {phone && /^(08|62)/.test(phone.replace(/\D/g, '')) && phone.replace(/\D/g, '').length > 14 && (
                    <p className="text-xs text-red-500 mt-1">Maksimal 14 digit</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Kata Sandi</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 8 karakter"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 transition-all ${password && (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-navy-200 focus:ring-teal-400/50 focus:border-teal-400'}`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-1.5 space-y-0.5">
                      <p className={`text-xs ${password.length >= 8 ? 'text-teal-600' : 'text-red-500'}`}>
                        {password.length >= 8 ? '✓' : '✗'} Minimal 8 karakter
                      </p>
                      <p className={`text-xs ${/[a-z]/.test(password) ? 'text-teal-600' : 'text-red-500'}`}>
                        {/[a-z]/.test(password) ? '✓' : '✗'} Huruf kecil
                      </p>
                      <p className={`text-xs ${/[A-Z]/.test(password) ? 'text-teal-600' : 'text-red-500'}`}>
                        {/[A-Z]/.test(password) ? '✓' : '✗'} Huruf kapital
                      </p>
                      <p className={`text-xs ${/[^a-zA-Z0-9]/.test(password) ? 'text-teal-600' : 'text-red-500'}`}>
                        {/[^a-zA-Z0-9]/.test(password) ? '✓' : '✗'} Simbol (!@#$%)
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi kata sandi"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 transition-all ${confirmPassword && confirmPassword !== password ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-navy-200 focus:ring-teal-400/50 focus:border-teal-400'}`} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-500 mt-1">Kata sandi tidak cocok</p>
                  )}
                </div>

                <p className="text-xs text-navy-500">
                  Saya menyetujui <a href="#" className="text-teal-600 font-semibold hover:underline">Syarat & Ketentuan</a> serta <a href="#" className="text-teal-600 font-semibold hover:underline">Kebijakan Privasi</a>
                </p>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <X size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-teal-600/20 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Daftar Sekarang'
                  )}
                </button>

                <p className="text-center text-sm text-navy-500 pt-1">
                  Sudah punya akun?{' '}
                  <Link to="/masuk" className="font-semibold text-teal-600 hover:text-teal-700 underline">Masuk di sini</Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/30"
          >
            <CheckCircle2 size={20} />
            <span className="font-semibold text-sm">Pendaftaran berhasil! Mengalihkan...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
