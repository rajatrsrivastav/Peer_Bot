"use client";
import { useState, useEffect } from "react";
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Bot } from 'lucide-react'
import { getAllChatBots } from "@/services/explore";
import { useRouter } from "next/navigation";
import { Footer } from '../../components/Footer'

const Explore = () => {
  
  const [allChatbot, setAllChatbot] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    getAllChatBots()
      .then((data) => {
        setAllChatbot(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="py-16 md:py-24 bg-brand-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-brand-text mb-4">
            Explore Chatbots
          </h1>
          <p className="text-xl text-brand-textLight max-w-2xl mx-auto">
            Discover featured chatbots and templates to get started quickly.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allChatbot.map((bot, idx) => (
              <Card
                key={bot.name + idx}
                className="flex flex-col h-full hover:border-brand-primary/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-textLight bg-gray-100 px-2 py-1 rounded">
                    Business
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-text mb-2 group-hover:text-brand-primary transition-colors">
                  {bot.name}
                </h3>
                <p className="text-brand-textLight text-sm mb-6 flex-grow">
                  {bot.context}
                </p>

                <div className="mt-auto pt-4 border-t border-brand-border flex justify-between items-center">
                  <span className="text-sm font-medium text-brand-textLight">
                    Created by: user1
                  </span>
                  <Button
                    onClick={() => router.push(`/chatbot/${bot.name}`)}
                    size="sm"
                  >
                    Try it
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
