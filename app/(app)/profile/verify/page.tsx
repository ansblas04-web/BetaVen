"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CheckCircle } from "lucide-react";

export default function VerifyPage() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);

  const handleTakePhoto = () => {
    // Placeholder for taking a photo
    setPhoto("/placeholder.svg");
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-4 pt-16 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {step === 0 && (
              <>
                <p className="text-muted-foreground mb-6">
                  Get a blue checkmark next to your name by verifying your profile with a photo.
                </p>
                <Button onClick={() => setStep(1)}>Get Verified</Button>
              </>
            )}
            {step === 1 && (
              <>
                <p className="text-muted-foreground mb-6">
                  Please take a photo of yourself holding your right hand up like this:
                </p>
                <div className="flex justify-center mb-6">
                  {/* Placeholder for pose image */}
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-5xl">✋</span>
                  </div>
                </div>
                <Button onClick={handleTakePhoto}>
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h2 className="text-2xl font-bold mb-4">Verification Submitted</h2>
                <p className="text-muted-foreground mb-6">
                  We'll review your photo and let you know once your profile is verified.
                </p>
                <Button onClick={() => window.history.back()}>Done</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
