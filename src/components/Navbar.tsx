import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  FileText,
  BarChart3,
  HelpCircle,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Lapor', href: '/lapor', icon: FileText },
  { label: 'Status', href: '/progres', icon: BarChart3 },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
]

interface NavbarProps {
  /** Force always-scrolled (white) style — used on pages without hero */
  forceScrolled?: boolean
}

export default function Navbar({ forceScrolled = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(forceScrolled)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ nama: string } | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Check login state
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { setUser(null) }
    } else {
      setUser(null)
    }
  }, [location]) // re-check on route change

  useEffect(() => {
    if (forceScrolled) {
      setScrolled(true)
      return
    }
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [forceScrolled])

  const isActive = (href: string) => location.pathname === href

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowProfileMenu(false)
    navigate('/')
  }

  const initial = user?.nama?.charAt(0).toUpperCase() || '?'

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-navy-900/5 border-b border-navy-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-colors ${
                scrolled
                  ? 'bg-gradient-to-br from-navy-800 to-navy-900'
                  : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              RW
            </div>
            <span
              className={`font-heading font-bold text-lg tracking-tight transition-colors ${
                scrolled ? 'text-navy-900' : 'text-white'
              }`}
            >
              ROADWATCHER
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? scrolled
                      ? 'bg-navy-800 text-white shadow-md shadow-navy-800/30'
                      : 'bg-white/20 text-white backdrop-blur-sm'
                    : scrolled
                    ? 'text-navy-600 hover:text-navy-800 hover:bg-navy-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <link.icon size={15} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth / Profile (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              /* Profile Avatar */
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                    scrolled
                      ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/30'
                      : 'bg-white text-navy-900 shadow-md shadow-black/10'
                  }`}
                >
                  {initial}
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl shadow-navy-900/10 border border-navy-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-navy-100">
                        <p className="text-sm font-semibold text-navy-800 truncate">{user.nama}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Guest buttons */
              <>
                <Link
                  to="/masuk"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    scrolled
                      ? 'text-navy-700 hover:text-navy-900 hover:bg-navy-50'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Masuk
                </Link>
                <Link
                  to="/daftar"
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    scrolled
                      ? 'bg-navy-800 text-white hover:bg-navy-900 shadow-md shadow-navy-800/20'
                      : 'bg-white text-navy-900 hover:bg-white/90 shadow-md shadow-black/10'
                  }`}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled
                ? 'text-navy-700 hover:bg-navy-50'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-navy-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-navy-800 text-white'
                      : 'text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-navy-100">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                        {initial}
                      </div>
                      <span className="text-sm font-semibold text-navy-800 truncate">{user.nama}</span>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/masuk"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-navy-700 border border-navy-200 hover:bg-navy-50 transition-colors"
                    >
                      <LogIn size={16} />
                      Masuk
                    </Link>
                    <Link
                      to="/daftar"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-navy-800 text-white hover:bg-navy-900 transition-colors"
                    >
                      <UserPlus size={16} />
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
