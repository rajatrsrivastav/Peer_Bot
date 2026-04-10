import { getChatbotByName } from "../../utils";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return new Response(JSON.stringify({ err: "Name query param missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await getChatbotByName(name);

    if (!data) {
      return new Response(JSON.stringify({ err: "Chatbot not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
