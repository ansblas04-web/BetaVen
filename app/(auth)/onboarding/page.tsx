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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "+91", // India default country code
    displayName: "",
    birthdate: "",
    gender: "",
    orientation: "",
    bio: "",
    interests: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Submit profile data to API
    console.log("Profile data:", formData);

    // Navigate to main app
    router.push("/");
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Welcome to Dirty Nobita</CardTitle>
          <CardDescription>
            Let's set up your profile (Step {step} of 4)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📱 Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value="+91"
                      disabled
                      className="px-3 py-2 border rounded-md bg-gray-100 w-20 font-semibold cursor-not-allowed"
                    >
                      <option value="+91">🇮🇳 +91</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.phone.replace(/^\+91/, "")}
                      onChange={(e) => {
                        const phone = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, phone: "+91" + phone });
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      className="flex-1 px-3 py-2 border rounded-md bg-background"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">India is set as default. Your phone will be used for verification.</p>
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
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Orientation
                  </label>
                  <select
                    value={formData.orientation}
                    onChange={(e) =>
                      setFormData({ ...formData, orientation: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Select...</option>
                    <option value="straight">Straight</option>
                    <option value="gay">Gay</option>
                    <option value="lesbian">Lesbian</option>
                    <option value="bisexual">Bisexual</option>
                    <option value="pansexual">Pansexual</option>
                    <option value="asexual">Asexual</option>
                    <option value="queer">Queer</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bio (optional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Photos
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    Photo upload coming soon
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
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
