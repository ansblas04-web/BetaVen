"use client";

import { Card } from "@/components/ui/card";

export function Photos() {
  // Mock data
  const photos = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <Card key={index} className="aspect-square overflow-hidden">
          <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
        </Card>
      ))}
    </div>
  );
}
