import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ProgresPage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar forceScrolled />

      <main className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-navy-900 mb-4">
            Progres
          </h1>
          <div className="inline-block px-6 py-4 bg-white rounded-2xl border border-navy-200 shadow-sm">
            <p className="text-lg md:text-xl font-semibold text-navy-500">
              "BELUM TAU MAU DI ISI APA"
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
