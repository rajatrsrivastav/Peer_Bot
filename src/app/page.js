"use client"
export const dynamic = 'force-dynamic';
import { HeroSection } from '../components/HeroSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { CTASection } from '../components/CTASection'
import { Footer } from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
