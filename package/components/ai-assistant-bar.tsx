"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Minimize2, Maximize2, ArrowUp, MessageSquare, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface AIAssistantConfig {
  // Required: AI integration
  onSendMessage: (message: string, history: AIMessage[]) => Promise<string>

  // Optional: Customization
  assistantName?: string
  assistantIcon?: string // URL to icon image
  placeholder?: string
  welcomeMessage?: string
  suggestedPrompts?: string[]

  // Optional: Styling
  brandColor?: string
  allowMinimize?: boolean
}

interface AIAssistantBarProps {
  config: AIAssistantConfig
}

type ViewState = "minimized" | "collapsed" | "expanded" | "fullscreen"

export const AIAssistantBar: React.FC<AIAssistantBarProps> = ({ config }) => {
  const [viewState, setViewState] = useState<ViewState>("collapsed")
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    assistantName = "Legal Assistant",
    assistantIcon = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-11-11%20at%2019.06.06-lH3VF48nnvY8JvK7gLrcswCke3VFsm.png",
    placeholder = "Ask about policies or compliance...",
    welcomeMessage = "👋 Need help understanding policies or compliance requirements? Let me know!",
    suggestedPrompts = ["Explain the privacy policy", "What are the main changes?", "Who needs to accept this?"],
    brandColor = "#6366F1",
    allowMinimize = true,
  } = config

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0 && welcomeMessage) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when expanded
  useEffect(() => {
    if (viewState === "expanded" || viewState === "fullscreen") {
      inputRef.current?.focus()
    }
  }, [viewState])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await config.onSendMessage(userMessage.content, messages)

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("AI Assistant error:", error)
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt)
    if (viewState === "collapsed") {
      setViewState("expanded")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const ChatInterface = ({ isFullscreen }: { isFullscreen: boolean }) => {
    if (isFullscreen) {
      return (
        <div className="h-full flex bg-white">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50/50">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <img src={assistantIcon || "/placeholder.svg"} alt="AI" className="h-8 w-8" />
                <h2 className="font-semibold text-blue-600 text-lg">{assistantName.toLowerCase()}</h2>
              </div>
              <Button
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 gap-2 rounded-lg font-medium"
                onClick={() => {
                  setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: welcomeMessage,
                      timestamp: new Date(),
                    },
                  ])
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Start New Chat
              </Button>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex-1 overflow-auto">
              <div className="p-3">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="h-4 w-4" />
                  My Updates
                </button>
              </div>

              <div className="px-3 pb-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-3">This Month</div>
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-200 text-gray-900 rounded-lg font-medium">
                  Current Conversation
                </button>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 leading-relaxed">
                {assistantName} may make mistakes and is not legal, financial or investment advice.
              </p>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Policy Questions?</h3>
                <Button size="sm" variant="ghost" className="h-6 rounded">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-gray-100"
                onClick={() => setViewState("expanded")}
              >
                <Minimize2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden bg-white">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4 max-w-4xl mx-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {message.role === "assistant" && (
                        <img
                          src={assistantIcon || "/placeholder.svg"}
                          alt="AI"
                          className="h-8 w-8 flex-shrink-0 mt-1"
                        />
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 max-w-[75%]",
                          message.role === "user"
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-800 rounded-tl-sm",
                        )}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <img src={assistantIcon || "/placeholder.svg"} alt="AI" className="h-8 w-8 flex-shrink-0 mt-1" />
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                  <img src={assistantIcon || "/placeholder.svg"} alt="AI" className="h-7 w-7 flex-shrink-0" />
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type @ to quick search"
                    disabled={isLoading}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-gray-400"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="h-9 w-9 rounded-full flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowUp className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-blue-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={assistantIcon || "/placeholder.svg"} alt="AI Assistant" className="h-8 w-8" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{assistantName}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg hover:bg-blue-50"
              onClick={() => setViewState("fullscreen")}
            >
              <Maximize2 className="h-4 w-4 text-gray-600" />
            </Button>
            {allowMinimize && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-blue-50"
                onClick={() => setViewState("collapsed")}
              >
                <Minimize2 className="h-4 w-4 text-gray-600" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <img src={assistantIcon || "/placeholder.svg"} alt="AI" className="h-8 w-8 flex-shrink-0" />
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[85%]",
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm",
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <img src={assistantIcon || "/placeholder.svg"} alt="AI" className="h-8 w-8 flex-shrink-0" />
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input area */}
        <div
          className="p-3 border-t border-blue-100 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 100%)",
          }}
        >
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
            <img src={assistantIcon || "/placeholder.svg"} alt="AI" className="h-6 w-6 flex-shrink-0" />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type @ to quick search"
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-8 w-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              <ArrowUp className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Minimized state: just icon
  if (viewState === "minimized") {
    return (
      <div className="flex items-center justify-center p-3">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          style={{
            backgroundColor: "#E8EEFF",
            border: "2px solid #D0D9FF",
          }}
          onClick={() => setViewState("collapsed")}
        >
          <img src={assistantIcon || "/placeholder.svg"} alt="AI Assistant" className="h-7 w-7" />
        </Button>
      </div>
    )
  }

  // Collapsed state: bar with icon and text
  if (viewState === "collapsed") {
    return (
      <div className="p-3">
        <div
          className="rounded-2xl shadow-lg transition-all p-1"
          style={{
            background: "linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 100%)",
            border: "2px solid #D0D9FF",
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
            <img src={assistantIcon || "/placeholder.svg"} alt="AI Assistant" className="h-8 w-8 flex-shrink-0" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setViewState("expanded")}
              placeholder={placeholder}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-gray-600"
            />
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-gray-100"
                onClick={() => setViewState("minimized")}
              >
                <Minimize2 className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-gray-100"
                onClick={() => setViewState("fullscreen")}
              >
                <Maximize2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (viewState === "fullscreen") {
    return (
      <Dialog open={true} onOpenChange={() => setViewState("expanded")}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0 bg-white">
          <ChatInterface isFullscreen={true} />
        </DialogContent>
      </Dialog>
    )
  }

  // Expanded state: integrated chat window
  return (
    <div className="h-[500px] border-t border-gray-200">
      <div
        className="h-full"
        style={{
          background: "linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 100%)",
        }}
      >
        <ChatInterface isFullscreen={false} />
      </div>
    </div>
  )
}
