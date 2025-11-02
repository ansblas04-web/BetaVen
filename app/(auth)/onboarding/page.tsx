"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // Start with welcome screen
  const [formData, setFormData] = useState({
    displayName: "",
    birthdate: "",
    gender: "",
    orientation: "",
    bio: "",
    interests: [] as string[],
    prompts: [] as { question: string; answer: string }[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Submit profile data to API
    console.log("Profile data:", formData);

    // Navigate to main app
    router.push("/");
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Welcome to Dirty Nobita</CardTitle>
          <CardDescription>
            Let's set up your profile (Step {step} of 5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Find your person.</h2>
              <p className="text-muted-foreground mb-6">
                We help you find the best matches based on your personality and preferences.
              </p>
              <Button onClick={nextStep}>Get Started</Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Photos
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    Photo upload coming soon
                  </div>
                </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="How should we call you?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthdate: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Select...</option>
                    <option value="woman">Woman</option>
                    <option value="man">Man</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Interests (select a few)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Travel",
                      "Music",
                      "Art",
                      "Fitness",
                      "Food",
                      "Gaming",
                      "Reading",
                      "Movies",
                    ].map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={
                          formData.interests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          const newInterests = formData.interests.includes(
                            interest
                          )
                            ? formData.interests.filter((i) => i !== interest)
                            : [...formData.interests, interest];
                          setFormData({ ...formData, interests: newInterests });
                        }}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Answer a prompt
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    Prompts coming soon
                  </div>
                </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  Complete Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
