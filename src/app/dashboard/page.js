"use client"

import { useContext, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthContext } from "@/context/auth"
import { ChatbotContext } from "@/context/chatbot"
import { createChatBot, getChatBots } from "@/services/chatbot"
import { getToken } from "@/helpers/auth"
import { useAuth } from "@/hooks/useAuth"
import PrivateRoute from "@/components/PrivateRoute"

import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import {
  Plus,
  Search,
  MoreVertical,
  FileText,
  MessageSquare,
  Settings,
  Trash2,
  ExternalLink,
} from 'lucide-react'

const Dashboard = () => {
  const { chatbots, setChatbots } = useContext(ChatbotContext)
  const [botName, setBotName] = useState("")
  const [botContext, setBotContext] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { authMethod } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    const token = authMethod === 'custom' ? getToken() : null
    getChatBots({ token })
      .then((res) => {
        setChatbots(res)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [setChatbots, authMethod])

  const handleAddBot = async () => {
    if (botName.trim() === "" || botContext.trim() === "" || isCreating) return

    setIsCreating(true)
    try {
      const newBot = { name: botName, context: botContext }
      setChatbots((prev) => [...prev, newBot])
      const token = authMethod === 'custom' ? getToken() : null
      await createChatBot({ name: botName, context: botContext, token })

      setBotName("")
      setBotContext("")
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to create bot:", error)
      alert("Failed to create bot. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const filteredBots = chatbots.filter(bot =>
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.context.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-brand-background pb-12">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-brand-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-text">
                My Chatbots
              </h1>
              <p className="text-brand-textLight mt-1">
                Manage your AI assistants and knowledge bases
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Bot
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chatbots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Bots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </Card>
            ))
          ) : (
            <>
              {filteredBots.map((bot, index) => (
                <Card
                  key={index}
                  className="flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                      <BotIcon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-brand-text mb-1">
                    {bot.name}
                  </h3>
                  <p className="text-sm text-brand-textLight mb-6 line-clamp-2">
                    {bot.context}
                  </p>

                  <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" /> 0 docs
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> 0 chats
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"
                    >
                      Active
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      className="text-xs"
                    >
                      <Settings className="w-3 h-3 mr-1" /> Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      className="text-xs"
                      onClick={() => router.push(`/chatbot/${bot.name}`)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" /> Chat
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Create New Placeholder */}
              <button 
                className="flex flex-col items-center justify-center h-full min-h-[240px] border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-brand-primary" />
                </div>
                <span className="font-medium text-brand-text group-hover:text-brand-primary">
                  Create New Chatbot
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Upload docs to get started
                </span>
              </button>
            </>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-brand-text mb-4">
            Recent Activity
          </h2>
          <Card noPadding>
            <div className="divide-y divide-brand-border">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-text">
                        John Doe updated{' '}
                        <span className="text-brand-primary">
                          Engineering Onboarding
                        </span>
                      </p>
                      <p className="text-xs text-brand-textLight">
                        Added &quot;AWS_Credentials.pdf&quot; • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Bot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Create New Chatbot</h3>
            <div className="space-y-4">
              <Input
                label="Bot Name"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Enter a name for your chatbot"
              />
              <div>
                <label className="block text-sm font-medium text-brand-textLight mb-1.5">
                  Bot Context
                </label>
                <textarea
                  value={botContext}
                  onChange={(e) => setBotContext(e.target.value)}
                  placeholder="Describe what your chatbot should know and how it should respond"
                  rows={5}
                  className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBot} isLoading={isCreating}>
                Create Chatbot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BotIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path d="M12 8v4" />
      <rect width="16" height="12" x="4" y="12" rx="2" />
      <path d="M9 17v2" />
      <path d="M15 17v2" />
    </svg>
  )
}

export default function ProtectedDashboard() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  )
}