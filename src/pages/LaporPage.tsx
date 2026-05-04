import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
  X,
  Info,
  MapPinned,
  CircleOff,
  Zap,
  Waves,
  Building2,
  Upload,
  Send,
  ImageIcon,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ============================
   Types & Constants
   ============================ */

interface FormData {
  photos: File[]
  photoPreviewUrls: string[]
  area: string
  namaJalan: string
  jenisKerusakan: string
  deskripsi: string
}

const STEPS = [
  { id: 1, label: 'Foto', icon: Camera },
  { id: 2, label: 'Lokasi', icon: MapPin },
  { id: 3, label: 'Detail', icon: FileText },
]

const JENIS_KERUSAKAN = [
  { id: 'berlubang', label: 'Berlubang', icon: CircleOff },
  { id: 'retak', label: 'Retak', icon: Zap },
  { id: 'bergelombang', label: 'Bergelombang', icon: Waves },
  { id: 'drainase', label: 'Drainase Rusak', icon: Building2 },
]

/* ============================
   Step Progress Bar
   ============================ */

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Background line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-navy-200" />
          {/* Active line */}
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500"
            initial={{ width: '0%' }}
            animate={{
              width:
                currentStep === 1
                  ? '0%'
                  : currentStep === 2
                  ? '50%'
                  : '100%',
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            const isUpcoming = step.id > currentStep

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted || isCurrent
                      ? 'bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                      : 'bg-white border-2 border-navy-200 text-navy-400'
                  }`}
                >
                  {step.id}
                </motion.div>
                <span
                  className={`text-xs font-semibold mt-2 transition-colors ${
                    isCurrent
                      ? 'text-navy-800'
                      : isCompleted
                      ? 'text-teal-600'
                      : isUpcoming
                      ? 'text-navy-400'
                      : 'text-navy-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============================
   Step 1: Foto
   ============================ */

function StepFoto({
  formData,
  onChange,
}: {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      const newPhotos = [...formData.photos, ...files]
      const newPreviews = [
        ...formData.photoPreviewUrls,
        ...files.map((file) => URL.createObjectURL(file)),
      ]

      onChange({ photos: newPhotos, photoPreviewUrls: newPreviews })
    },
    [formData.photos, formData.photoPreviewUrls, onChange]
  )

  const removePhoto = useCallback(
    (index: number) => {
      const newPhotos = formData.photos.filter((_, i) => i !== index)
      // Revoke old URL
      URL.revokeObjectURL(formData.photoPreviewUrls[index])
      const newPreviews = formData.photoPreviewUrls.filter(
        (_, i) => i !== index
      )
      onChange({ photos: newPhotos, photoPreviewUrls: newPreviews })
    },
    [formData.photos, formData.photoPreviewUrls, onChange]
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">
          Ambil Foto
        </h2>
        <p className="text-navy-500 text-sm">
          Ambil foto kerusakan jalan atau fasilitas umum untuk dapat melaporkan.
        </p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-2xl py-16 px-6 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-teal-400 transition-all duration-200 group"
      >
        <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mb-4 group-hover:bg-navy-200 transition-colors">
          <Camera size={28} className="text-navy-500" />
        </div>
        <p className="font-semibold text-navy-700 mb-1">Ambil Foto</p>
        <p className="text-xs text-navy-400">
          Foto dengan kualitas baik membantu verifikasi lebih cepat
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Photo previews */}
      {formData.photoPreviewUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {formData.photoPreviewUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-navy-100">
              <img
                src={url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Add more button */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-navy-200 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all"
          >
            <Upload size={18} className="text-navy-400 mb-1" />
            <span className="text-[10px] text-navy-400">Tambah</span>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-teal-50/60 border border-teal-200/60 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-teal-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-navy-800 text-sm mb-1">
              TAHUKAH ANDA?
            </p>
            <p className="text-navy-600 text-xs leading-relaxed">
              Kawasan beban jalan dikembangkan oleh kepolisian dan dinas terkait
              lainnya. Dihitung sesuai dengan Peraturan Pemerintah No. 32 Tahun
              2011 tentang standar beban kendaraan
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                'Standar Beban Sumbu Terberat (JBB/JBKT)',
                'Dimuat maks 8 ton/sumbu roda (tergantung Konfigurasi)',
                'Konfigurasi maksimum memiliki 10 sumbu dengan JBI hingga 50 ton',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-navy-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-navy-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ============================
   Step 2: Lokasi
   ============================ */

function StepLokasi({
  formData,
  onChange,
}: {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">
          Tentukan Lokasi
        </h2>
        <p className="text-navy-500 text-sm">
          Pilih titik kerusakan pada peta untuk akurasi laporan yang lebih baik.
        </p>
      </div>

      {/* Map placeholder */}
      <div className="relative bg-navy-100 rounded-2xl overflow-hidden" style={{ height: 280 }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-navy-200 flex items-center justify-center mb-3">
            <MapPinned size={26} className="text-navy-500" />
          </div>
          <p className="font-semibold text-navy-600 text-sm">Peta Interaktif</p>
          <p className="text-xs text-navy-400 mt-0.5">
            Klik untuk menentukan lokasi
          </p>
        </div>
      </div>

      {/* Area / Wilayah */}
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-2">
          Area / Wilayah <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.area}
          onChange={(e) => onChange({ area: e.target.value })}
          placeholder="Contoh: Kecamatan Cileunyi"
          className="w-full px-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all"
        />
      </div>

      {/* Nama Jalan */}
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-2">
          Nama Jalan / Landmark <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400"
          />
          <input
            type="text"
            value={formData.namaJalan}
            onChange={(e) => onChange({ namaJalan: e.target.value })}
            placeholder="Contoh: Jl. Raya Utama dekat SPBU"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all"
          />
        </div>
        <p className="text-xs text-navy-400 mt-1.5">
          Gunakan nama jalan yang dikenal atau landmark terdekat.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-navy-800 text-sm mb-1">
              Mengapa Lokasi Penting?
            </p>
            <p className="text-navy-600 text-xs leading-relaxed">
              Poin lokasi yang tepat akan memudahkan tim peninjauan lapangan dan
              petugas yang melakukan perbaikan. Pastikan pin yang anda pilih
              sangat akurat agar kerusakan bisa terselesaikan dengan cepat.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ============================
   Step 3: Detail
   ============================ */

function StepDetail({
  formData,
  onChange,
}: {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">
          Detail Laporan
        </h2>
      </div>

      {/* Jenis Kerusakan */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-navy-600 mb-4">
          Jenis Kerusakan
        </p>
        <div className="grid grid-cols-2 gap-3">
          {JENIS_KERUSAKAN.map((jenis) => {
            const selected = formData.jenisKerusakan === jenis.id
            return (
              <button
                key={jenis.id}
                onClick={() => onChange({ jenisKerusakan: jenis.id })}
                className={`flex flex-col items-center gap-2.5 py-6 px-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  selected
                    ? 'border-teal-400 bg-teal-50 shadow-md shadow-teal-500/10'
                    : 'border-navy-100 bg-white hover:border-navy-200 hover:bg-navy-50/50'
                }`}
              >
                <jenis.icon
                  size={22}
                  className={
                    selected ? 'text-teal-600' : 'text-navy-400'
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    selected ? 'text-teal-700' : 'text-navy-600'
                  }`}
                >
                  {jenis.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <textarea
          value={formData.deskripsi}
          onChange={(e) => onChange({ deskripsi: e.target.value })}
          placeholder="Jelaskan detail lokasi atau tingkat keparahan kerusakan..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all resize-none"
        />
      </div>

      {/* Photo reference hint */}
      <div>
        <p className="text-xs text-navy-400 italic mb-3">
          Pastikan foto yang diunggah sebelumnya terlihat jelas seperti referensi
          berikut:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-navy-100 rounded-xl aspect-video flex items-center justify-center">
            <ImageIcon size={24} className="text-navy-300" />
          </div>
          <div className="bg-navy-100 rounded-xl aspect-video flex items-center justify-center">
            <ImageIcon size={24} className="text-navy-300" />
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-navy-800 text-sm mb-1">
              Tahukah Anda?
            </p>
            <p className="text-navy-600 text-xs leading-relaxed">
              Laporan yang lengkap dengan koordinat GPS dan foto yang jelas
              membantu petugas kami melakukan perbaikan 40% lebih cepat.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ============================
   Main Lapor Page
   ============================ */

export default function LaporPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    photos: [],
    photoPreviewUrls: [],
    area: '',
    namaJalan: '',
    jenisKerusakan: '',
    deskripsi: '',
  })

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const goNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1)
  }

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleSubmit = () => {
    // TODO: integrate with API
    alert('Laporan berhasil dikirim! (demo)')
    navigate('/')
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar forceScrolled />

      {/* Page Header */}
      <div className="pt-16 bg-white border-b border-navy-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-sm font-bold tracking-wider uppercase text-navy-800">
              Langkah {currentStep} dari 3
            </h1>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Step Progress */}
        <StepProgress currentStep={currentStep} />
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-gradient-to-b from-navy-50 to-amber-50/30">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepFoto
                key="step-foto"
                formData={formData}
                onChange={updateFormData}
              />
            )}
            {currentStep === 2 && (
              <StepLokasi
                key="step-lokasi"
                formData={formData}
                onChange={updateFormData}
              />
            )}
            {currentStep === 3 && (
              <StepDetail
                key="step-detail"
                formData={formData}
                onChange={updateFormData}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-navy-100 py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {currentStep > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-navy-200 text-navy-700 font-semibold text-sm hover:bg-navy-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Kembali
            </motion.button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={goNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-navy-600 to-navy-700 text-white font-semibold text-sm shadow-lg shadow-navy-700/20 hover:from-navy-700 hover:to-navy-800 active:scale-[0.98] transition-all"
            >
              Lanjut
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-teal-600/20 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all"
            >
              Kirim Laporan
              <Send size={16} />
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
