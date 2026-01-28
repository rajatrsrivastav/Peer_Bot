"use client"
import { Card } from './ui/Card'
import {
  Upload,
  Lock,
  Share2,
  Search,
  Database,
  MessageSquare,
} from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: <Upload className="w-6 h-6 text-brand-primary" />,
      title: 'Document Ingestion',
      description:
        'Upload PDFs, Word docs, or connect Notion pages. We automatically parse and index your content for retrieval.',
    },
    {
      icon: <Database className="w-6 h-6 text-brand-primary" />,
      title: 'RAG Technology',
      description:
        'Advanced Retrieval-Augmented Generation ensures answers are strictly grounded in your provided context, reducing hallucinations.',
    },
    {
      icon: <Lock className="w-6 h-6 text-brand-primary" />,
      title: 'Enterprise Security',
      description:
        'Your data is encrypted at rest and in transit. We use SOC2 compliant infrastructure and strict access controls.',
    },
    {
      icon: <Share2 className="w-6 h-6 text-brand-primary" />,
      title: 'Easy Sharing',
      description:
        'Generate secure links to share bots internally with specific teams or embed them in your internal wiki.',
    },
    {
      icon: <Search className="w-6 h-6 text-brand-primary" />,
      title: 'Semantic Search',
      description:
        'Our vector database understands intent, not just keywords, helping employees find exactly what they need.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-brand-primary" />,
      title: 'Contextual History',
      description:
        'Bots remember previous turn of conversation, allowing for natural follow-up questions and deeper inquiry.',
    },
  ]
  return (
    <section className="py-24 bg-brand-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-brand-text mb-4">
            Built for internal knowledge management
          </h2>
          <p className="text-lg text-brand-textLight">
            Everything you need to create secure, accurate AI assistants for
            your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-brand-text mb-3">
                {feature.title}
              </h3>
              <p className="text-brand-textLight leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}