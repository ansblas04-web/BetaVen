"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/nav/BottomNav";
import { VerificationSection } from "@/components/profile/VerificationSection";
import { Loader2, Plus, X } from "lucide-react";

const INTEREST_OPTIONS = [
  "Travel", "Music", "Art", "Fitness", "Food", "Gaming",
  "Reading", "Movies", "Photography", "Hiking", "Cooking",
  "Dancing", "Yoga", "Coffee", "Wine", "Dogs", "Cats"
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    birthdate: "",
    gender: "",
    orientation: "",
    bio: "",
    interests: [] as string[],
    height: "",
    drinking: "",
    smoking: "",
    wantsKids: "",
    lookingFor: "",
    ageMin: "18",
    ageMax: "99",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      
      if (data.profile) {
        const profileData = {
          displayName: data.profile.displayName || '',
          birthdate: data.profile.birthdate ? new Date(data.profile.birthdate).toISOString().split('T')[0] : '',
          gender: data.profile.gender || '',
          orientation: data.profile.orientation || '',
          bio: data.profile.bio || '',
          interests: typeof data.profile.interests === 'string' ? JSON.parse(data.profile.interests) : data.profile.interests || [],
          height: data.profile.height?.toString() || '',
          drinking: data.profile.drinking || '',
          smoking: data.profile.smoking || '',
          wantsKids: data.profile.wantsKids || '',
          lookingFor: data.profile.lookingFor || '',
          ageMin: data.profile.ageMin?.toString() || '18',
          ageMax: data.profile.ageMax?.toString() || '99',
        };
        setProfile(profileData);
        setFormData(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          height: formData.height ? parseInt(formData.height) : null,
          ageMin: parseInt(formData.ageMin),
          ageMax: parseInt(formData.ageMax),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(formData);
        setIsEditing(false);
      } else {
        alert('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-4 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Manage your dating profile
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell people about yourself..."
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <Label>Interests (select up to 5)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        size="sm"
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        onClick={() => {
                          const newInterests = formData.interests.includes(interest)
                            ? formData.interests.filter((i) => i !== interest)
                            : formData.interests.length < 5
                            ? [...formData.interests, interest]
                            : formData.interests;
                          setFormData({ ...formData, interests: newInterests });
                        }}
                        disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Physical Attributes */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lookingFor">Looking For</Label>
                    <select
                      id="lookingFor"
                      value={formData.lookingFor}
                      onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="">Select...</option>
                      <option value="relationship">Relationship</option>
                      <option value="casual">Casual</option>
                      <option value="friends">Friends</option>
                    </select>
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="drinking">Drinking</Label>
                    <select
                      id="drinking"
                      value={formData.drinking}
                      onChange={(e) => setFormData({ ...formData, drinking: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="">Select...</option>
                      <option value="never">Never</option>
                      <option value="socially">Socially</option>
                      <option value="regularly">Regularly</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="smoking">Smoking</Label>
                    <select
                      id="smoking"
                      value={formData.smoking}
                      onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="">Select...</option>
                      <option value="never">Never</option>
                      <option value="socially">Socially</option>
                      <option value="regularly">Regularly</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="wantsKids">Want Kids</Label>
                    <select
                      id="wantsKids"
                      value={formData.wantsKids}
                      onChange={(e) => setFormData({ ...formData, wantsKids: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="maybe">Maybe</option>
                    </select>
                  </div>
                </div>

                {/* Age Preferences */}
                <div>
                  <Label>Age Range Preference</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Input
                        type="number"
                        value={formData.ageMin}
                        onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                        placeholder="Min age"
                        min="18"
                        max="99"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={formData.ageMax}
                        onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                        placeholder="Max age"
                        min="18"
                        max="99"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Age range: {formData.ageMin} - {formData.ageMax} years
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData(profile);
                      setIsEditing(false);
                    }}
                    className="flex-1"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div>
                  <h3 className="font-semibold text-xl">{profile.displayName}</h3>
                  {profile.gender && profile.orientation && (
                    <p className="text-sm text-muted-foreground">
                      {profile.gender} • {profile.orientation}
                    </p>
                  )}
                </div>

                {/* Verification Section */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-lg mb-4">Identity Verification</h3>
                  <VerificationSection />
                </div>

                {profile.bio && (
                  <div>
                    <Label className="text-muted-foreground">Bio</Label>
                    <p className="text-sm mt-1">{profile.bio}</p>
                  </div>
                )}

                {profile.interests.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.interests.map((interest: string) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {profile.height && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Height</Label>
                      <p className="text-sm font-medium">{profile.height} cm</p>
                    </div>
                  )}
                  {profile.lookingFor && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Looking For</Label>
                      <p className="text-sm font-medium capitalize">{profile.lookingFor}</p>
                    </div>
                  )}
                  {profile.drinking && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Drinking</Label>
                      <p className="text-sm font-medium capitalize">{profile.drinking}</p>
                    </div>
                  )}
                  {profile.smoking && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Smoking</Label>
                      <p className="text-sm font-medium capitalize">{profile.smoking}</p>
                    </div>
                  )}
                  {profile.wantsKids && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Want Kids</Label>
                      <p className="text-sm font-medium capitalize">{profile.wantsKids}</p>
                    </div>
                  )}
                </div>

                {profile.ageMin && profile.ageMax && (
                  <div className="pt-4 border-t">
                    <Label className="text-muted-foreground text-xs">Age Preference</Label>
                    <p className="text-sm font-medium">{profile.ageMin} - {profile.ageMax} years</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        {/* Logout Card */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Account</h3>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: '/signin' })}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
