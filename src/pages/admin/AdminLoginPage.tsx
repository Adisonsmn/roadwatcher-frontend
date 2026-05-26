import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldAlert, ChevronLeft } from 'lucide-react'
import api from '@/lib/api'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already logged in as admin
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const user = JSON.parse(stored)
        const email = user.email.toLowerCase()
        const isAdmin = email.includes('admin') || email.endsWith('@dputr.go.id') || email === 'dputrbandung'
        if (isAdmin) {
          navigate('/admin/analytics')
        }
      } catch (err) {
        // Ignored
      }
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username dan kata sandi wajib diisi')
      return
    }

    setLoading(true)
    try {
      // Map username to the backend email field
      const res = await api.post('/auth/login', { email: username, password })
      
      // Save token and user details
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      // Navigate straight to dashboard analytics
      navigate('/admin/analytics')
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.error || 'Username atau password salah'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

      {/* Back to Public Site Link */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ChevronLeft size={14} /> Kembali ke Beranda
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-navy-900 border border-navy-800 rounded-3xl overflow-hidden shadow-2xl relative z-10">
        
        {/* Card Header */}
        <div className="bg-gradient-to-br from-navy-950 to-navy-900 px-8 py-8 text-center border-b border-navy-800/80">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
            <Lock size={22} className="text-teal-400" />
          </div>
          <h1 className="text-lg font-heading font-extrabold text-white tracking-wide uppercase">Sistem Administrasi</h1>
          <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mt-0.5">Portal Internal DPUTR Kab.</p>
        </div>

        {/* Card Body / Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5 text-left">
          
          {/* Username Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                placeholder="Masukkan username Anda..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-xs text-slate-200 placeholder-navy-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Kata Sandi</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-navy-950 border border-navy-800 rounded-xl text-xs text-slate-200 placeholder-navy-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-600/10 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk ke Dashboard <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-950/40 border border-red-900/30 text-red-400 text-xs mt-4">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Gagal Masuk</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{error}</p>
              </div>
            </div>
          )}

        </form>

      </div>

      {/* Footer Branding Info */}
      <p className="text-center text-[10px] text-slate-500 mt-6 relative z-10 font-medium">
        © 2026 DPUTR Kab. — Hak Cipta Dilindungi Undang-Undang.
      </p>

    </div>
  )
}
