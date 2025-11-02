"use client";

import { Card } from "@/components/ui/card";

export function Prompts() {
  // Mock data
  const prompts = [
    {
      question: "I'm looking for...",
      answer: "Someone to go on adventures with.",
    },
    {
      question: "A fun fact I love is...",
      answer: "That otters hold hands while they sleep.",
    },
    {
      question: "My simple pleasures are...",
      answer: "A good cup of coffee in the morning.",
    },
  ];

  return (
    <div className="space-y-4">
      {prompts.map((prompt, index) => (
        <Card key={index} className="p-4">
          <h4 className="font-semibold text-lg">{prompt.question}</h4>
          <p className="text-muted-foreground">{prompt.answer}</p>
        </Card>
      ))}
    </div>
  );
}
