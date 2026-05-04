import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import StatsSection from '@/components/StatsSection'
import EducationSection from '@/components/EducationSection'
import HelpSection from '@/components/HelpSection'
import Footer from '@/components/Footer'

export default function BerandaPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <EducationSection />
        <HelpSection />
      </main>
      <Footer />
    </>
  )
}
