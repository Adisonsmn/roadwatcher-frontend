import { motion } from 'framer-motion'
import {
  HelpCircle,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
} from 'lucide-react'

export default function HelpSection() {
  return (
    <section
      id="help"
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/8 rounded-full blur-[120px]" />
      </div>

      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[1px]">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H1440V40C1440 40 1320 80 1080 70C840 60 720 30 480 50C240 70 120 60 0 50V0Z"
            fill="#f0f4f8"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center px-4">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30"
        >
          <HelpCircle size={28} className="text-white" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-2xl md:text-3xl font-heading font-bold text-teal-300 mb-3"
        >
          Butuh Bantuan Lain?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-navy-300 text-sm md:text-base mb-10"
        >
          Tim kami siap melayani informasi terkait infrastruktur jalan 24/7.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3 mb-10"
        >
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-200"
          >
            <MessageCircle size={18} className="text-green-400" />
            Hubungi WhatsApp
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform text-navy-400"
            />
          </a>

          <a
            href="#faq"
            className="group flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl text-white font-semibold shadow-lg shadow-teal-600/30 hover:shadow-teal-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            <ExternalLink size={18} />
            Lihat FAQ
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>

        {/* Secondary contacts */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-navy-500 text-xs tracking-wide mb-3">
            Atau hubungi kami melalui:
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="mailto:info@roadwatcher.id"
              className="flex items-center gap-1.5 text-navy-400 hover:text-teal-300 text-sm transition-colors"
            >
              <Mail size={14} />
              Email
            </a>
            <a
              href="tel:+6281234567890"
              className="flex items-center gap-1.5 text-navy-400 hover:text-teal-300 text-sm transition-colors"
            >
              <Phone size={14} />
              Telepon
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
