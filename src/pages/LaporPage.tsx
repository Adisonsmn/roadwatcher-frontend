import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Camera, MapPin, FileText, ArrowRight, ArrowLeft, X, Info,
  CircleOff, Zap, Waves, Building2, Upload, Send, Locate,
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import ExifReader from 'exifreader'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useToast } from '@/components/Toast'
import api from '@/lib/api'

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/* ============================
   Types & Constants
   ============================ */

interface FormData {
  photos: File[]
  photoPreviewUrls: string[]
  latitude: number | null
  longitude: number | null
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

// Kabupaten Bandung center
const DEFAULT_CENTER: [number, number] = [-6.9175, 107.6191]

const KECAMATAN_BANDUNG = [
  'Baleendah','Banjaran','Bojongsoang','Cangkuang','Cicalengka','Cikancung',
  'Cilengkrang','Cileunyi','Cimaung','Cimenyan','Ciparay','Ciwidey',
  'Dayeuhkolot','Ibun','Katapang','Kertasari','Kutawaringin','Majalaya',
  'Margaasih','Margahayu','Nagreg','Pameungpeuk','Pangalengan','Paseh',
  'Pasirjambu','Rancabali','Rancaekek','Solokanjeruk','Soreang',
]

/* ============================
   Step Progress Bar
   ============================ */

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-navy-200" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500"
            initial={{ width: '0%' }}
            animate={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
          {STEPS.map((step) => {
            const isCurrent = step.id === currentStep
            const isCompleted = step.id < currentStep
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <motion.div animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted || isCurrent
                      ? 'bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                      : 'bg-white border-2 border-navy-200 text-navy-400'
                  }`}>{step.id}</motion.div>
                <span className={`text-xs font-semibold mt-2 transition-colors ${
                  isCurrent ? 'text-navy-800' : isCompleted ? 'text-teal-600' : 'text-navy-400'
                }`}>{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============================
   EXIF GPS Helper
   ============================ */

async function extractGPS(file: File): Promise<{ lat: number; lng: number } | null> {
  try {
    const tags = await ExifReader.load(file)
    const lat = tags?.GPSLatitude?.description
    const lng = tags?.GPSLongitude?.description
    if (lat && lng) {
      const latNum = parseFloat(String(lat))
      const lngNum = parseFloat(String(lng))
      const latRef = (tags?.GPSLatitudeRef?.value as any)?.[0]
      const lngRef = (tags?.GPSLongitudeRef?.value as any)?.[0]
      return {
        lat: latRef === 'S' ? -Math.abs(latNum) : latNum,
        lng: lngRef === 'W' ? -Math.abs(lngNum) : lngNum,
      }
    }
  } catch { /* no GPS data */ }
  return null
}

/* ============================
   Step 1: Foto
   ============================ */

function StepFoto({ formData, onChange }: { formData: FormData; onChange: (d: Partial<FormData>) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [gpsFound, setGpsFound] = useState(false)
  const { showToast } = useToast()

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    let newPhotos = [...formData.photos, ...files]
    let newPreviews = [...formData.photoPreviewUrls, ...files.map(f => URL.createObjectURL(f))]

    if (newPhotos.length > 5) {
      showToast({ type: 'warning', title: 'Perhatian', message: 'Maksimal 5 foto yang dapat diunggah. Foto yang berlebih akan diabaikan.' })
      newPhotos = newPhotos.slice(0, 5)
      newPreviews = newPreviews.slice(0, 5)
    }

    const update: Partial<FormData> = { photos: newPhotos, photoPreviewUrls: newPreviews }

    // Try extract GPS from first photo
    if (!formData.latitude) {
      for (const file of files) {
        const gps = await extractGPS(file)
        if (gps) {
          update.latitude = gps.lat
          update.longitude = gps.lng
          setGpsFound(true)
          break
        }
      }
    }
    onChange(update)
  }, [formData, onChange])

  const removePhoto = useCallback((index: number) => {
    URL.revokeObjectURL(formData.photoPreviewUrls[index])
    onChange({
      photos: formData.photos.filter((_, i) => i !== index),
      photoPreviewUrls: formData.photoPreviewUrls.filter((_, i) => i !== index),
    })
  }, [formData, onChange])

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">Ambil Foto</h2>
        <p className="text-navy-500 text-sm">Ambil foto kerusakan jalan untuk melaporkan.</p>
      </div>

      <div onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-2xl py-16 px-6 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-teal-400 transition-all group">
        <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mb-4 group-hover:bg-navy-200 transition-colors">
          <Camera size={28} className="text-navy-500" />
        </div>
        <p className="font-semibold text-navy-700 mb-1">Ambil Foto</p>
        <p className="text-xs text-navy-400">Foto dengan kualitas baik membantu verifikasi lebih cepat</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      </div>

      {formData.photoPreviewUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {formData.photoPreviewUrls.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-navy-100">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              <button onClick={() => removePhoto(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <X size={12} />
              </button>
            </div>
          ))}
          <div onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-navy-200 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all">
            <Upload size={18} className="text-navy-400 mb-1" />
            <span className="text-[10px] text-navy-400">Tambah</span>
          </div>
        </div>
      )}

      {gpsFound && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-sm">
          <MapPin size={16} className="shrink-0" />
          <span>Lokasi GPS terdeteksi dari foto! Akan otomatis digunakan di langkah berikutnya.</span>
        </div>
      )}

      <div className="bg-teal-50/60 border border-teal-200/60 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-teal-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-navy-800 text-sm mb-1">Tips Foto yang Baik</p>
            <ul className="space-y-1">
              {['Foto dari jarak dekat agar kerusakan terlihat jelas', 'Pastikan pencahayaan cukup', 'Sertakan area sekitar sebagai referensi'].map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-navy-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy-400 shrink-0" />{t}
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
   Map Click Handler
   ============================ */

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.flyTo([lat, lng], 16, { duration: 1 }) }, [lat, lng, map])
  return null
}

/* ============================
   Step 2: Lokasi (Leaflet Map)
   ============================ */

function StepLokasi({ formData, onChange }: { formData: FormData; onChange: (d: Partial<FormData>) => void }) {
  const [locating, setLocating] = useState(false)

  const handleMapClick = useCallback((lat: number, lng: number) => {
    onChange({ latitude: lat, longitude: lng })
    reverseGeocode(lat, lng)
  }, [onChange])

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`)
      const data = await res.json()
      const addr = data.address || {}
      const area = addr.suburb || addr.village || addr.town || addr.city_district || ''
      const road = addr.road || addr.display_name?.split(',')[0] || ''
      if (area) onChange({ area })
      if (road) onChange({ namaJalan: road })
    } catch { /* ignore */ }
  }

  const handleLocateMe = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        reverseGeocode(pos.coords.latitude, pos.coords.longitude)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    )
  }

  // Use GPS from photo or default
  const center: [number, number] = formData.latitude && formData.longitude
    ? [formData.latitude, formData.longitude]
    : DEFAULT_CENTER

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">Tentukan Lokasi</h2>
        <p className="text-navy-500 text-sm">Klik pada peta untuk menentukan titik kerusakan jalan.</p>
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border border-navy-200" style={{ height: 320 }}>
        <MapContainer center={center} zoom={formData.latitude ? 16 : 12} scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {formData.latitude && formData.longitude && (
            <>
              <Marker position={[formData.latitude, formData.longitude]} />
              <FlyToLocation lat={formData.latitude} lng={formData.longitude} />
            </>
          )}
        </MapContainer>

        {/* Locate me button */}
        <button onClick={handleLocateMe} disabled={locating}
          className="absolute bottom-3 right-3 z-[1000] flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-lg text-sm font-semibold text-navy-700 hover:bg-navy-50 transition-all border border-navy-200 cursor-pointer disabled:opacity-50">
          <Locate size={16} className={locating ? 'animate-spin' : ''} />
          {locating ? 'Mencari...' : 'Lokasi Saya'}
        </button>
      </div>

      {formData.latitude && formData.longitude && (
        <p className="text-xs text-teal-600 font-medium">
          📍 Koordinat: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
        </p>
      )}

      {/* Area / Wilayah */}
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-2">
          Area / Wilayah <span className="text-red-500">*</span>
        </label>
        <select value={formData.area} onChange={(e) => onChange({ area: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all">
          <option value="">Pilih Kecamatan</option>
          {KECAMATAN_BANDUNG.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Nama Jalan */}
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-2">
          Nama Jalan / Landmark <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
          <input type="text" value={formData.namaJalan} onChange={(e) => onChange({ namaJalan: e.target.value })}
            placeholder="Contoh: Jl. Raya Utama dekat SPBU"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all" />
        </div>
      </div>

      <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-navy-600 text-xs leading-relaxed">
            <span className="font-semibold text-navy-800">Lokasi otomatis:</span> Jika foto memiliki data GPS, lokasi akan terisi otomatis. Anda tetap bisa mengubahnya dengan klik pada peta.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ============================
   Step 3: Detail
   ============================ */

function StepDetail({ formData, onChange }: { formData: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">Detail Laporan</h2>
      </div>

      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-navy-600 mb-4">Jenis Kerusakan</p>
        <div className="grid grid-cols-2 gap-3">
          {JENIS_KERUSAKAN.map((jenis) => {
            const selected = formData.jenisKerusakan === jenis.id
            return (
              <button key={jenis.id} onClick={() => onChange({ jenisKerusakan: jenis.id })}
                className={`flex flex-col items-center gap-2.5 py-6 px-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  selected ? 'border-teal-400 bg-teal-50 shadow-md shadow-teal-500/10' : 'border-navy-100 bg-white hover:border-navy-200 hover:bg-navy-50/50'
                }`}>
                <jenis.icon size={22} className={selected ? 'text-teal-600' : 'text-navy-400'} />
                <span className={`text-sm font-medium ${selected ? 'text-teal-700' : 'text-navy-600'}`}>{jenis.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <textarea value={formData.deskripsi} onChange={(e) => onChange({ deskripsi: e.target.value })}
          placeholder="Jelaskan detail lokasi atau tingkat keparahan kerusakan..."
          rows={4} className="w-full px-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all resize-none" />
      </div>

      <div>
        <p className="text-xs text-navy-400 italic mb-3">Pastikan foto yang diunggah terlihat jelas seperti referensi berikut:</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-navy-100 rounded-xl aspect-video flex items-center justify-center overflow-hidden">
            <img src="/reference_road_1.png" alt="Referensi 1" className="w-full h-full object-cover" />
          </div>
          <div className="bg-navy-100 rounded-xl aspect-video flex items-center justify-center overflow-hidden">
            <img src="/reference_road_2.png" alt="Referensi 2" className="w-full h-full object-cover" />
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
  const { showToast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    photos: [], photoPreviewUrls: [],
    latitude: null, longitude: null,
    area: '', namaJalan: '', jenisKerusakan: '', deskripsi: '',
  })

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const goNext = () => {
    if (currentStep === 1 && formData.photos.length === 0) {
      showToast({ type: 'warning', title: 'Perhatian', message: 'Silakan unggah minimal 1 foto laporan terlebih dahulu.' })
      return
    }
    if (currentStep === 2 && (!formData.area || !formData.namaJalan)) {
      showToast({ type: 'warning', title: 'Perhatian', message: 'Pastikan titik lokasi di peta, area kecamatan, dan detail nama jalan sudah terisi lengkap.' })
      return
    }
    if (currentStep < 3) setCurrentStep((s) => s + 1)
  }
  const goBack = () => { if (currentStep > 1) setCurrentStep((s) => s - 1) }

  const handleSubmit = async () => {
    if (!formData.jenisKerusakan) {
      showToast({ type: 'warning', title: 'Perhatian', message: 'Pilih salah satu jenis kerusakan terlebih dahulu.' })
      return
    }
    if (!formData.photos.length) return
    setLoading(true)
    try {
      const fd = new window.FormData()
      formData.photos.forEach((p) => fd.append('foto', p))
      if (formData.latitude) fd.append('latitude', String(formData.latitude))
      if (formData.longitude) fd.append('longitude', String(formData.longitude))
      fd.append('area', formData.area)
      fd.append('namaJalan', formData.namaJalan)
      fd.append('jenisKerusakan', formData.jenisKerusakan)
      fd.append('deskripsi', formData.deskripsi)

      await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/progres')
    } catch {
      showToast({ type: 'error', title: 'Gagal', message: 'Gagal mengirim laporan. Coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar forceScrolled />
      <div className="pt-16 bg-white border-b border-navy-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-sm font-bold tracking-wider uppercase text-navy-800">Langkah {currentStep} dari 3</h1>
            <button onClick={() => navigate('/')} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <StepProgress currentStep={currentStep} />
      </div>

      <div className="flex-1 bg-gradient-to-b from-navy-50 to-amber-50/30">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <StepFoto key="s1" formData={formData} onChange={updateFormData} />}
            {currentStep === 2 && <StepLokasi key="s2" formData={formData} onChange={updateFormData} />}
            {currentStep === 3 && <StepDetail key="s3" formData={formData} onChange={updateFormData} />}
          </AnimatePresence>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-navy-100 py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {currentStep > 1 && (
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={goBack}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-navy-200 text-navy-700 font-semibold text-sm hover:bg-navy-50 transition-colors">
              <ArrowLeft size={16} /> Kembali
            </motion.button>
          )}
          {currentStep < 3 ? (
            <button onClick={goNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-navy-600 to-navy-700 text-white font-semibold text-sm shadow-lg shadow-navy-700/20 hover:from-navy-700 hover:to-navy-800 active:scale-[0.98] transition-all">
              Lanjut <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-teal-600/20 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Kirim Laporan</>}
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
