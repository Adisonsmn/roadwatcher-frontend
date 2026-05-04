import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, ChevronDown, CheckCircle2, MessageCircle, Mail,
  ArrowLeft, FileText, MapPin, User, Shield, LayoutList,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface FaqItem { id: number; question: string; answer: string; category: string }

const FAQ_DATA: FaqItem[] = [
  { id: 1, question: 'Bagaimana cara melaporkan kerusakan jalan?', answer: 'Anda dapat melaporkan kerusakan jalan melalui halaman "Lapor". Cukup unggah foto, tentukan lokasi, dan isi detail laporan. Prosesnya hanya 2-3 menit.', category: 'pelaporan' },
  { id: 2, question: 'Apakah saya perlu membuat akun untuk melaporkan?', answer: 'Ya, Anda perlu mendaftar terlebih dahulu. Proses pendaftaran gratis dan sangat cepat.', category: 'pelaporan' },
  { id: 3, question: 'Jenis kerusakan apa saja yang bisa dilaporkan?', answer: 'Jalan berlubang, retak, bergelombang, drainase rusak, dan kerusakan fasilitas umum lainnya.', category: 'pelaporan' },
  { id: 4, question: 'Apakah ada biaya untuk melaporkan kerusakan jalan?', answer: 'Tidak, layanan ini sepenuhnya gratis untuk seluruh masyarakat.', category: 'pelaporan' },
  { id: 5, question: 'Berapa lama waktu yang dibutuhkan untuk membuat laporan?', answer: 'Hanya 2-3 menit melalui 3 langkah sederhana: foto, lokasi, dan detail.', category: 'pelaporan' },
  { id: 6, question: 'Bagaimana cara melihat status laporan saya?', answer: 'Melalui halaman "Progres". Login dan lihat semua laporan beserta statusnya secara real-time.', category: 'tracking' },
  { id: 7, question: 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan laporan?', answer: 'Kerusakan ringan 3-7 hari kerja, kerusakan berat 14-30 hari kerja.', category: 'tracking' },
  { id: 8, question: 'Apakah saya akan mendapat notifikasi tentang progress laporan?', answer: 'Ya, melalui email dan dashboard akun Anda setiap ada pembaruan status.', category: 'tracking' },
  { id: 9, question: 'Apa yang harus saya lakukan jika laporan saya ditolak?', answer: 'Anda akan menerima alasan penolakan dan dapat memperbaiki serta mengirim ulang laporan.', category: 'tracking' },
  { id: 10, question: 'Bagaimana cara membuat akun?', answer: 'Klik "Daftar", isi nama lengkap, email, nomor telepon, dan kata sandi. Gratis dan cepat.', category: 'akun' },
  { id: 11, question: 'Lupa kata sandi, bagaimana cara mengatur ulang?', answer: 'Klik "Lupa kata sandi?" di halaman masuk, lalu cek email untuk tautan reset.', category: 'akun' },
  { id: 12, question: 'Bisakah saya mengubah data profil saya?', answer: 'Ya, melalui halaman pengaturan akun setelah login.', category: 'akun' },
  { id: 13, question: 'Apakah data pribadi saya aman?', answer: 'Ya, data dienkripsi dengan standar keamanan tinggi dan tidak dibagikan ke pihak ketiga.', category: 'privasi' },
  { id: 14, question: 'Data apa saja yang dikumpulkan saat melaporkan?', answer: 'Foto kerusakan, koordinat lokasi, deskripsi, dan data akun pelapor.', category: 'privasi' },
  { id: 15, question: 'Apakah laporan saya bisa dilihat publik?', answer: 'Laporan terverifikasi tampil di peta publik, namun identitas pelapor tetap dirahasiakan.', category: 'privasi' },
]

const CATEGORIES = [
  { id: 'semua', label: 'Semua', icon: LayoutList },
  { id: 'pelaporan', label: 'Pelaporan', icon: FileText },
  { id: 'tracking', label: 'Tracking', icon: MapPin },
  { id: 'akun', label: 'Akun', icon: User },
  { id: 'privasi', label: 'Privasi', icon: Shield },
]

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-md hover:shadow-navy-100/50 transition-shadow">
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} className="text-teal-500" />
        </div>
        <span className="flex-1 text-sm font-medium text-navy-700">{item.question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-navy-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-4 pl-[4.25rem]">
              <p className="text-sm text-navy-500 leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FaqPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('semua')
  const [openId, setOpenId] = useState<number | null>(null)

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchCat = activeCategory === 'semua' || faq.category === activeCategory
      const matchSearch = !search.trim() || faq.question.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar forceScrolled />

      {/* Hero Banner */}
      <section className="relative pt-16 overflow-hidden">
        <div className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 py-16 md:py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/8 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/15 border border-teal-400/30 backdrop-blur-sm mb-6">
              <span className="text-sm">❓</span>
              <span className="text-teal-200 text-sm font-semibold tracking-wide">BANTUAN & DUKUNGAN</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-4">
              <span className="text-white">Frequently Asked</span>
              <span className="text-teal-300">Questions</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-navy-300 text-sm md:text-base mb-8">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan pelaporan kami
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="max-w-lg mx-auto relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pertanyaan..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-navy-800 text-sm placeholder:text-navy-300 border border-navy-200 focus:outline-none focus:ring-2 focus:ring-teal-400/50 shadow-lg shadow-navy-900/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="bg-white border-b border-navy-100 sticky top-16 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat.id ? 'bg-navy-800 text-white shadow-md' : 'text-navy-500 hover:text-navy-700 hover:bg-navy-50'
              }`}>
              <cat.icon size={14} />{cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="flex-1 bg-gradient-to-b from-navy-50 to-amber-50/30 py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <Search size={40} className="text-navy-200 mx-auto mb-4" />
              <p className="text-navy-400 font-medium">Tidak ada pertanyaan ditemukan</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} item={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />
            ))
          )}
        </div>
      </div>

      {/* CTA Card */}
      <div className="px-4 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-8 md:p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/20 flex items-center justify-center mb-5">
              <MessageCircle size={26} className="text-teal-300" />
            </div>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">Masih Ada Pertanyaan?</h3>
            <p className="text-navy-300 text-sm mb-6 max-w-md mx-auto">Tim support kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami!</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-800 font-semibold text-sm hover:bg-navy-50 transition-colors w-full sm:w-auto">
                💬 WhatsApp
              </a>
              <a href="mailto:support@roadwatcher.id"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-colors w-full sm:w-auto">
                <Mail size={16} />Email
              </a>
            </div>
            <div className="border-t border-navy-700 pt-5">
              <Link to="/" className="inline-flex items-center gap-2 text-navy-300 text-sm hover:text-white transition-colors">
                <ArrowLeft size={14} />Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
