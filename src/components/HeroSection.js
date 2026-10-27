"use client"
import { Button } from './ui/Button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-brand-text tracking-tight mb-6 leading-tight">
              Turn your team knowledge into{' '}
              <span className="text-brand-primary">
                intelligent AI assistants
              </span>
            </h1>

            <p className="text-xl text-brand-textLight mb-10 leading-relaxed max-w-2xl mx-auto">
              Add your own instructions and trusted context to create focused
              AI chatbots for onboarding, support, and everyday questions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/auth/signup'}
                className="min-w-[160px]"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => window.location.href = '/explore'}
                className="min-w-[160px] group"
              >
                View Demo{' '}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Subtle background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>
    </section>
  )
}
