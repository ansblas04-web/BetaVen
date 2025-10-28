"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Upload, Camera, AlertCircle } from "lucide-react";

const POSES = [
  {
    id: "smile",
    label: "Smile",
    description: "Smile naturally at the camera",
    emoji: "😊",
  },
  {
    id: "neutral",
    label: "Neutral Face",
    description: "Look straight ahead with neutral expression",
    emoji: "😐",
  },
  {
    id: "turn_left",
    label: "Turn Left",
    description: "Turn your head to the left",
    emoji: "😼",
  },
];

interface VerificationAttempt {
  id: string;
  status: string;
  pose: string;
  createdAt: string;
  rejectionReason?: string;
}

interface VerificationData {
  profile: {
    isVerified: boolean;
    verificationStatus: string;
  };
  attempts: VerificationAttempt[];
  requiredPoses: string[];
}

export function VerificationSection() {
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const res = await fetch("/api/verification");
      const data = await res.json();
      setVerificationData(data);
    } catch (error) {
      console.error("Error fetching verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPhoto = async () => {
    if (!selectedPose || !photoUrl) {
      alert("Please select a pose and provide a photo URL");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoUrl,
          pose: selectedPose,
        }),
      });

      if (res.ok) {
        alert("Photo submitted successfully! Review typically takes 1-2 hours.");
        setPhotoUrl("");
        setSelectedPose(null);
        setShowUploadForm(false);
        fetchVerificationStatus();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit photo");
      }
    } catch (error) {
      alert("Error submitting photo");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading verification status...</div>;
  }

  if (!verificationData) {
    return null;
  }

  const { profile, attempts } = verificationData;
  const lastAttempt = attempts[0];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {profile.isVerified ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Verified
                  </>
                ) : profile.verificationStatus === "pending" ? (
                  <>
                    <Clock className="w-5 h-5 text-yellow-500" />
                    Pending Review
                  </>
                ) : profile.verificationStatus === "rejected" ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    Verification Failed
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    Not Verified
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {profile.isVerified
                  ? "Your profile is verified ✓"
                  : profile.verificationStatus === "pending"
                  ? "Your verification is under review"
                  : profile.verificationStatus === "rejected"
                  ? `Rejected: ${lastAttempt?.rejectionReason || "Please try again"}`
                  : "Verify your identity to boost your profile"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {!profile.isVerified && (
          <CardContent>
            {!showUploadForm ? (
              <Button onClick={() => setShowUploadForm(true)} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Verification
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Pose
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {POSES.map((pose) => (
                      <button
                        key={pose.id}
                        onClick={() => setSelectedPose(pose.id)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          selectedPose === pose.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{pose.emoji}</div>
                        <div className="text-xs font-medium">{pose.label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {pose.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a clear selfie of you making the selected pose
                  </p>
                </div>

                {photoUrl && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preview
                    </label>
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={() => alert("Invalid image URL")}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowUploadForm(false);
                      setPhotoUrl("");
                      setSelectedPose(null);
                    }}
                    className="flex-1"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitPhoto}
                    disabled={uploading || !selectedPose || !photoUrl}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Submitting..." : "Submit Photo"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {attempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Verification History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {attempt.status === "approved" && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {attempt.status === "pending" && (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      {attempt.status === "rejected" && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {attempt.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Pose: {attempt.pose} • {new Date(attempt.createdAt).toLocaleDateString()}
                    </p>
                    {attempt.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">
                        Reason: {attempt.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


