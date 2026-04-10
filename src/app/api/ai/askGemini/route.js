import { createPrompt } from "../../helper";

export async function POST(request) {
    try {
        const { text, context } = await request.json();
        const prompt = createPrompt({ text, context });
        const GEMINI_API_KEY=process.env.GEMINI_API_KEY
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
            return new Response(JSON.stringify({ error: data.error.message }), {
                status: response.status,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

    } catch (err) {
        console.error("Error in POST handler:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}