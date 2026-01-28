"use client"
import { Button } from './ui/Button'

export function CTASection() {
  return (
    <section className="py-24 bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-text rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to streamline your internal knowledge?
            </h2>
            <p className="text-lg text-gray-300 mb-10">
              Join forward-thinking companies using PeerBot to empower their
              teams with instant answers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/auth/signup'}
                className="bg-white text-brand-text hover:bg-gray-100 border-none"
              >
                Get Started for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/explore'}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Explore Use Cases
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}