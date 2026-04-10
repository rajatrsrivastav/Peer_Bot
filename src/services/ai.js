export const askGemini = async ({ text, context, debug } = {}) => {
  // Default debug from query param or build-time env var
  const urlDebug = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "true";
  const envDebug = process.env.NEXT_PUBLIC_GEMINI_DEBUG === "true";
  const useDebug = debug || urlDebug || envDebug;

  const response = await fetch("/api/ai/askGemini", {
    method: "POST",
    body: JSON.stringify({ text, context, debug: useDebug }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    if (useDebug) {
      return { providerError: data, status: response.status };
    }

    let error = "Unknown Gemini API error";
    if (data) error = data?.error || data?.message || error;
    return {
      reply: "The AI service is unavailable right now. Please try again later.",
      error,
      fallback: true,
    };
  }

  return data;
};
