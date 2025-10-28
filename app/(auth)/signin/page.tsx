"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Heart } from "lucide-react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const error = searchParams.get("error");

  // Redirect to feed if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/feed");
    }
  }, [status, session, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { redirect: true, callbackUrl: "/onboarding" });
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email || !password) {
      setEmailError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setEmailError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Sign in after successful signup
        await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/onboarding",
        });
      } else {
        const data = await res.json();
        setEmailError(data.error || "Failed to create account");
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setEmailError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Dirty Nobita
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with people near you
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to start meeting new people
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error === "OAuthSignin" && "Failed to connect with Google"}
                {error === "OAuthCallback" && "Failed to complete sign in"}
                {error === "OAuthCreateAccount" && "Unable to create account"}
              </div>
            )}

            {/* Google SSO Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-900 text-gray-500 dark:text-gray-400">
                  or sign up with email
                </span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {emailError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {emailError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-400">
                <strong>Note:</strong> Email verification is optional. You can verify your email later in profile settings.
              </p>
            </div>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By signing in, you agree to our{" "}
              <a href="#" className="text-pink-500 hover:text-pink-600">
                Terms of Service
              </a>
              {" "}and{" "}
              <a href="#" className="text-pink-500 hover:text-pink-600">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Super Likes</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🌟</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Top Picks</p>
          </div>
          <div>
            <div className="text-2xl mb-2">✅</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}
