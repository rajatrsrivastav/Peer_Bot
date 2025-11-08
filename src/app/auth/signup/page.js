"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import "./signup.css";
import { signup } from "@/services/auth";
import PublicRoute from "@/components/PublicRoute";

function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
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
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      if (!form.name || !form.email || !form.password) {
        alert("Please fill all fields!");
        return;
      }
      setIsLoading(true);
      const response = await signup(form);
      const data = await response.json();
      alert(data.message);
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      // This will redirect to Google OAuth, create user in DB, and redirect to /dashboard
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
    } catch (error) {
      console.error('Google sign-up error:', error);
      alert('Failed to sign up with Google');
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="fromMain" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="fromMain">
      <div className="headerText">
        <h1>Create an account</h1>
        <p>Enter your details to create your ChatBot account</p>
      </div>

      <div className="formInput">
        <form className="form_main" onSubmit={handleSubmit}>
          <label className="label_form">Name</label>
          <br />
          <input
            className="form_input"
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={handleForm}
            disabled={isLoading}
          />
          <br />
          <label className="label_form">Email</label>
          <br />
          <input
            className="form_input"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleForm}
            disabled={isLoading}
          />
          <br />
          <label className="label_form">Password</label>
          <br />
          <input
            className="form_input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleForm}
            disabled={isLoading}
          />
          <br />
          <button className="submitButton" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="signup_loading">
                <span className="signup_spinner"></span>
                Signing up...
              </span>
            ) : (
              "Signup"
            )}
          </button>
        </form>

        <hr className="hr1" />
        
        <button 
          className="submitButton google-signup-btn" 
          onClick={handleGoogleSignUp}
          type="button"
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.11l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
          </svg>
          {isLoading ? 'Signing up...' : 'Sign up with Google'}
        </button>

        <hr className="hr1" />

        <p>
          Already have an account?{" "}
          <Link className="link" href="/auth/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ProtectedSignup() {
  return (
    <PublicRoute>
      <Signup />
    </PublicRoute>
  )
}