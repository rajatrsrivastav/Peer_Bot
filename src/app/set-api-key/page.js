"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateGeminiKey } from "@/services/ai";
import "./setApiKey.css";

function SetApiKey() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; 
    
    if (!apiKey.trim()) {
      alert("Please enter your Gemini API Key!");
      return;
    }

    setIsLoading(true);
    try {
      await validateGeminiKey(apiKey.trim());
      
      localStorage.setItem("geminiApiKey", apiKey);
      
      alert("API Key saved successfully!");
      router.push("/auth/login");
    } catch (err) {
      console.error("API Key validation failed:", err);
      alert("Failed to validate API Key. Please check your key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main_api">
      <div className="text_api">
        <h1>Set Your Gemini API Key</h1>
        <p>Follow the instructions below to obtain your Gemini API Key.</p>
      </div>
      
      <div className="form_api">
        <div className="instructions_api">
          <h2>How to Get Your Gemini API Key</h2>
          <ol>
            <li>Go to the <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="link_api">Gemini website</a>.</li>
            <li>Click on <strong>Get a Gemini API key in Google AI Studio</strong> to generate your unique API key.</li>
            <li>Log in to your Google account (or create one if you don not have one yet).</li>
            <li>Once logged in, Click on  <strong>+ Create API key</strong> button on top right</li>
            <li>Once generated, copy the API key and paste it into the field below.</li>
          </ol>
        </div>
        
        <form className="form_main1_api" onSubmit={handleSubmit}>
          <label className="label_form">Your Gemini API Key:</label>
          <br />
          <input
            className="input_form_api"
            type="password"
            autoComplete="off"
            placeholder="Paste your Gemini API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading}
          />
          <br />
          <button className="buttonn_form_api" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="api_key_loading">
                <span className="api_key_spinner"></span>
                Saving...
              </span>
            ) : (
              "Save API Key"
            )}
          </button>
        </form>
        
        
      </div>
    </div>
  );
}

export default SetApiKey;
