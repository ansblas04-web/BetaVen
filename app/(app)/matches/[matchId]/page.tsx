"use client";

import { useState, useEffect, use, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [matchUser, setMatchUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (matchId) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [matchId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/matches/${matchId}`);
      const data = await res.json();
      
      if (data.messages) {
        setMessages(data.messages);
      }
      if (data.otherUser && !matchUser) {
        setMatchUser(data.otherUser);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        // Add new message to list immediately
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-950 dark:to-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b p-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center font-bold">
            {matchUser?.displayName?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="font-semibold">
              {matchUser?.displayName || "Loading..."}
            </h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No messages yet.</p>
              <p className="text-sm mt-2">Send a message to start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-xs px-4 py-2 ${
                    isOwn
                      ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white"
                      : "bg-white dark:bg-neutral-800"
                  }`}
                >
                  <p className="text-sm">{message.body}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(message.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              </div>
            );
          })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-neutral-900 border-t p-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full bg-background"
          />
          <Button onClick={handleSend} size="icon" className="rounded-full">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
