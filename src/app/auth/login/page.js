"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import "./login.css";
import { login } from "@/services/auth";
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
      <div className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="text">
        <h1>Welcome back</h1>
        <p>Enter your email to sign in to your account</p>
      </div>
      <div className="form">
        <form
          className="form_main1"
          onChange={handleForm}
          onSubmit={handleSubmit}
        >
          <label className="label_form">Email</label>
          <br />
          <input
            className="input_form"
            name="email"
            type="email"
            placeholder="dummyuser@example.com"
            disabled={isLoading}
          />
          <br />
          <label className="label_form1">Password</label>
          <br />
          <input
            className="input_form"
            name="password"
            type="password"
            placeholder="password123"
            disabled={isLoading}
          />
          <br />
          <button className="buttonn_form" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="login_loading">
                <span className="login_spinner"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <hr className="hr2"></hr>
        <button 
          className="buttonn_form google-signin-btn" 
          onClick={handleGoogleSignIn}
          type="button"
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
          </svg>
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        <hr className="hr2"></hr>
        <p>
          Do not have an account?{" "}
          <Link className="link" href="/auth/signup">
            Signup
          </Link>{" "}
          first
        </p>
      </div>
      <div className="demo-credentials">
        <p>Want to try without signing up? Use demo account:</p>
        <p>dummyuser@example.com</p>
        <p>password123</p>
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