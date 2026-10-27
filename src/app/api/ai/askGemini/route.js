import { createPrompt } from "../../helper";

export async function POST(request) {
    try {
        const { text, context, debug, apiKey, validateOnly } = await request.json();
        const geminiApiKey = apiKey?.trim() || process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

        if (!geminiApiKey) {
            return new Response(
                JSON.stringify({
                    ...(validateOnly
                        ? { valid: false, error: "A Gemini API key is required." }
                        : {
                            reply: "AI service is not configured right now. Please try again later.",
                            fallback: true,
                        }),
                }),
                {
                    status: validateOnly ? 400 : 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!validateOnly && (typeof text !== "string" || !text.trim())) {
            return Response.json({ error: "A message is required." }, { status: 400 });
        }

        const prompt = validateOnly
            ? "Reply only with OK."
            : createPrompt({ text: text.trim(), context: typeof context === "string" ? context : "" });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
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

            if (validateOnly) {
                return Response.json(
                    { valid: false, error: errorMessage },
                    { status: response.status }
                );
            }

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

        if (validateOnly) {
            return Response.json({ valid: true });
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
