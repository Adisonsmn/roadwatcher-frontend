import { motion } from 'framer-motion'

// Import the education infographic images
import foto1 from '@/assets/images/foto1hd.jpeg'
import foto2 from '@/assets/images/foto2hd.jpeg'
import foto3 from '@/assets/images/foto3hd.jpeg'
import foto4 from '@/assets/images/foto4hd.jpeg'
import foto5 from '@/assets/images/foto5hd.jpeg'

const cards = [
  {
    title: 'Panduan Keselamatan Jalan',
    page: '1/6',
    image: foto1,
    caption: 'Memahami rambu-rambu dan keselamatan berkendara di area konstruksi.',
  },
  {
    title: 'Prosedur Perbaikan',
    page: '2/6',
    image: foto2,
    caption: null,
  },
  {
    title: 'Kapasitas Kendaraan & Beban Jalan',
    page: '3/6',
    image: foto3,
    caption: null,
  },
  {
    title: 'Alokasi Anggaran Pemeliharaan',
    page: '4/6',
    image: foto4,
    caption: null,
  },
  {
    title: 'Layanan Pengaduan 24/7',
    page: '5/6',
    image: foto5,
    caption: null,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function EducationSection() {
  return (
    <section id="education" className="py-16 md:py-24 px-4 bg-navy-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-1 h-8 bg-gradient-to-b from-navy-700 to-navy-500 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">
            Edukasi & Informasi
          </h2>
        </motion.div>

        {/* Cards Grid — first row: 3 cards, second row: 2 cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-6"
        >
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.slice(0, 3).map((card) => (
              <EducationCard key={card.page} card={card} />
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.slice(3).map((card) => (
              <EducationCard key={card.page} card={card} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function EducationCard({
  card,
}: {
  card: (typeof cards)[number]
}) {
  return (
    <motion.div
      variants={item}
      className="group bg-white rounded-2xl border border-navy-100/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy-900/8 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-navy-100/60 bg-navy-50/30">
        <h3 className="text-sm font-semibold text-navy-700 truncate">
          {card.title}
        </h3>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full ml-2 shrink-0">
          {card.page}
        </span>
      </div>

      {/* Card Image */}
      <div className="relative overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Card Caption */}
      {card.caption && (
        <div className="px-5 py-3 border-t border-navy-100/60">
          <p className="text-xs text-navy-500 leading-relaxed">
            {card.caption}
          </p>
        </div>
      )}
    </motion.div>
  )
}
