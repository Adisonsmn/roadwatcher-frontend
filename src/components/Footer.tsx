import { Plus, BarChart3, HelpCircle } from 'lucide-react'

const footerLinks = [
  { label: 'Hubungi Kami', href: '#' },
  { label: 'Layanan Publik', href: '#' },
  { label: 'Kebijakan Privasi', href: '#' },
  { label: 'Syarat & Ketentuan', href: '#' },
]

const footerNav = [
  { label: 'LAPOR', href: '#lapor', icon: Plus },
  { label: 'PROGRES', href: '#progres', icon: BarChart3 },
  { label: 'FAQ', href: '#faq', icon: HelpCircle },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-navy-100">
      {/* Logo & Tagline */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6 text-center">
        {/* Logo */}
        <div className="w-14 h-14 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-navy-900/20">
          <span className="text-white font-bold text-lg">RW</span>
        </div>
        <h3 className="text-lg font-heading font-bold text-navy-900 tracking-tight mb-2">
          ROADWATCHER
        </h3>
        <p className="text-sm text-navy-400 max-w-xs mx-auto leading-relaxed">
          Melayani dengan transparansi dan integritas untuk infrastruktur jalan
          yang lebih baik
        </p>
      </div>

      {/* Quick Nav */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="grid grid-cols-3 gap-4">
          {footerNav.map((navItem) => (
            <a
              key={navItem.label}
              href={navItem.href}
              className="flex flex-col items-center gap-2 py-4 rounded-xl hover:bg-navy-50 transition-colors group"
            >
              <navItem.icon
                size={20}
                className="text-navy-400 group-hover:text-navy-700 transition-colors"
              />
              <span className="text-xs font-bold tracking-wider text-navy-500 group-hover:text-navy-700 transition-colors">
                {navItem.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-navy-100">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-navy-400 hover:text-navy-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-center text-[11px] text-navy-400">
            © 2024 ROADWATCHER · Better Roads, Better Future
          </p>
          <p className="text-center text-[10px] text-navy-300 mt-1">
            Made with ❤️ for better infrastructure
          </p>
        </div>
      </div>
    </footer>
  )
}
