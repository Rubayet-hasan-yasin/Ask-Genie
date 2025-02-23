"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from '@ai-sdk/react'
import { Send, BrainCircuit, SquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatbotUI() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "api/chat"
  })
  const [rows, setRows] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  console.log(isLoading);


  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = Number.parseInt(getComputedStyle(textareaRef.current).lineHeight)
      const newRows = Math.min(5, Math.floor(textareaRef.current.scrollHeight / lineHeight))
      setRows(newRows)
    }
  }, [])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
    setRows(1)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Ask Genie</CardTitle>
        </CardHeader>
        <CardContent className="h-[70vh] overflow-y-auto space-y-4 ">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role !== "user" && <BrainCircuit className="mt-2 me-1" />}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <form onSubmit={onSubmit} className="flex w-full space-x-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow resize-none"
              rows={rows}
            />
            {isLoading ? (
              <Button type="button" size="icon" onClick={()=>stop()}>
                <SquareIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </div >
  )
}

