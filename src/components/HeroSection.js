"use client"
import { Button } from './ui/Button'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, FileText, Zap } from 'lucide-react'

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
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              {/* New: Enterprise SSO Integration */}
              New: Enterprise Integration

            {/* </div>  */}

            <h1 className="text-4xl md:text-6xl font-bold text-brand-text tracking-tight mb-6 leading-tight">
              Turn your company documents into{' '}
              <span className="text-brand-primary">
                intelligent AI assistants
              </span>
            </h1>

            <p className="text-xl text-brand-textLight mb-10 leading-relaxed max-w-2xl mx-auto">
              Securely upload your internal knowledge base and instantly create
              RAG-powered chatbots. Reduce dependency on senior staff and
              streamline onboarding.
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

            {/* <div className="mt-12 pt-8 border-t border-brand-border flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm text-brand-textLight font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
                <span>SOC2 Compliant Security</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-primary" />
                <span>Supports PDF, DOCX, Notion</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-primary" />
                <span>Instant Deployment</span>
              </div>
            </div> */}
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