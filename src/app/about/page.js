"use client"
import { Card } from '../../components/ui/Card'
import { CheckCircle } from 'lucide-react'
import { Footer } from '../../components/Footer'

const About = () => {
  return (
    <div className="py-16 md:py-24 bg-brand-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-brand-text mb-6">
            About PeerBot
          </h1>
          <p className="text-xl text-brand-textLight">
            We&apos;re on a mission to make organizational knowledge accessible,
            accurate, and instant.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-brand-text mb-4">
              The Problem
            </h2>
            <p className="text-brand-textLight leading-relaxed mb-6">
              In modern companies, knowledge is scattered across Google Drive,
              Notion, Slack, and PDFs. New employees struggle to find basic
              information, and senior staff spend hours answering repetitive
              questions. This &quot;knowledge silo&quot; problem slows down onboarding and
              reduces overall productivity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-text mb-4">
              Our Solution
            </h2>
            <p className="text-brand-textLight leading-relaxed mb-6">
              PeerBot is a secure, RAG-powered AI platform that connects to your
              internal documents. It creates specialized chatbots that answer
              questions based strictly on your company&apos;s context. No
              hallucinations, no general internet answers—just precise
              information from your own knowledge base.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-text mb-6">
              Key Use Cases
            </h2>
            <div className="grid gap-6">
              <Card className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text mb-2">
                    Employee Onboarding
                  </h3>
                  <p className="text-brand-textLight text-sm">
                    &quot;How do I set up my VPN?&quot; &quot;What is the expense policy?&quot; New
                    hires get instant answers without waiting for HR.
                  </p>
                </div>
              </Card>
              <Card className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text mb-2">
                    Technical Support
                  </h3>
                  <p className="text-brand-textLight text-sm">
                    Upload API documentation and engineering guides. Developers
                    can query the bot for code snippets and architecture
                    details.
                  </p>
                </div>
              </Card>
              <Card className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text mb-2">
                    Sales Enablement
                  </h3>
                  <p className="text-brand-textLight text-sm">
                    Give sales teams instant access to product specs, pricing
                    sheets, and competitive analysis during calls.
                  </p>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default About
