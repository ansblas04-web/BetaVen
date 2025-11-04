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
                    type="text"
                    inputMode="numeric"
                    value={formData.birthdate}
                    onChange={(e) => {
                      // Allow only numbers and dashes
                      let value = e.target.value.replace(/[^\d-]/g, '');
                      // Auto-format as user types: YYYY-MM-DD
                      if (value.length === 4 && !value.includes('-')) {
                        value = value + '-';
                      } else if (value.length === 7 && value.split('-').length === 2) {
                        value = value + '-';
                      }
                      setFormData({ ...formData, birthdate: value });
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value.length > 0 && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        alert("Please enter date in YYYY-MM-DD format (e.g., 1990-01-15)");
                      }
                    }}
                    required
                    placeholder="1990-01-15"
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: YYYY-MM-DD (e.g., 1990-01-15)
                  </p>
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
              {step > 0 && step !== 4 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step === 0 ? null : step < 4 ? (
                <Button 
                  type="button" 
                  onClick={() => {
                    // Validation for step 2 (basic info)
                    if (step === 2) {
                      if (!formData.displayName) {
                        alert("Please enter your display name");
                        return;
                      }
                      if (!formData.birthdate) {
                        alert("Please enter your date of birth");
                        return;
                      }
                      // Validate date format
                      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birthdate)) {
                        alert("Please enter date in YYYY-MM-DD format (e.g., 1990-01-15)");
                        return;
                      }
                      if (!formData.gender) {
                        alert("Please select your gender");
                        return;
                      }
                    }
                    nextStep();
                  }} 
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
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
