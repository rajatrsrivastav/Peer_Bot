"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Bot } from 'lucide-react'
import { login, getProfile } from "@/services/auth";
import { AuthContext } from "@/context/auth";
import PublicRoute from "@/components/PublicRoute";

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Redirect to dashboard if already authenticated via Google
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Check for errors from OAuth callback
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      alert(`Authentication failed: ${error}`);
    }
  }, [searchParams]);

  const handleForm = (e) => {
    const {name,value}=e.target
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (isLoading) return; 
      setIsLoading(true);
      const response = await login(form);
      const {
        token: { token },
      } = await response.json();
      localStorage.setItem("token", token);
      
      // Fetch and store user profile data
      try {
        const profileResponse = await getProfile();
        const { user } = await profileResponse.json();
        localStorage.setItem("userData", JSON.stringify(user));
      } catch (profileErr) {
        console.log("Failed to fetch profile:", profileErr);
        // Continue with login even if profile fetch fails
      }
      
      setIsLoggedIn(true);
      router.push("/dashboard");
    } catch (err) {
      alert(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // This will redirect to Google OAuth and then back to /dashboard
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white">
            <Bot size={28} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-brand-text">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-brand-textLight">
          Or{' '}
          <Link href="/auth/signup" className="font-medium text-brand-primary hover:text-brand-primaryHover">
            start your 14-day free trial
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <Input
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              value={form.email}
              onChange={handleForm}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleForm}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-brand-textLight"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-brand-primary hover:text-brand-primaryHover"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button fullWidth type="submit" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                fullWidth
                variant="secondary"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default function ProtectedLogin() {
  return (
    <PublicRoute>
      <Login />
    </PublicRoute>
  )
}