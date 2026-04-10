import { createPrompt } from "../../helper";

export async function POST(request) {
    try {
        const { text, context, debug } = await request.json();
        const prompt = createPrompt({ text, context });
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return new Response(
                JSON.stringify({
                    reply: "AI service is not configured right now. Please try again later.",
                    fallback: true,
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error?.message || `Request failed with status ${response.status}`;
            const isDenied = /denied access|quota exceeded|rate limit|unavailable/i.test(errorMessage);

            // If client requested debug or debug enabled via env, forward provider response and original status
            const forwardErrors = debug || process.env.GEMINI_DEBUG === "true" || process.env.NEXT_PUBLIC_GEMINI_DEBUG === "true";
            if (forwardErrors) {
                return new Response(
                    JSON.stringify({
                        providerError: data,
                        providerStatus: response.status,
                    }),
                    {
                        status: response.status,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            return new Response(
                JSON.stringify({
                    reply: isDenied
                        ? "The AI provider is temporarily unavailable for this project. Please try again later"
                        : "I could not generate a response right now. Please try again.",
                    error: errorMessage,
                    fallback: true,
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(No response received)";

        return new Response(
            JSON.stringify({
                reply,
                response: data,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (err) {
        console.error("Error in POST handler:", err);
        return new Response(
            JSON.stringify({
                reply: "I hit a temporary server error. Please try again.",
                error: err.message,
                fallback: true,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}