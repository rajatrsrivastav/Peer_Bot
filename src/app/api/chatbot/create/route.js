import { createConnection } from "@/config/db";
import { createChatbot, verifyToken } from "../../utils";
import { auth } from "@/app/api/auth/[...nextauth]/route";
await createConnection();
export async function POST(req) {

  try {
    const session = await auth();
    let email = session?.user?.email;

    if (!email) {
      const authHeader = req.headers.get("authorization");
      const accessToken = authHeader?.split(" ")[1];

      if (!accessToken || !(await verifyToken(accessToken))) {
        return new Response(JSON.stringify({ err: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const tokenEmail = accessToken.split("#@#")[1];
      if (!tokenEmail) {
        return new Response(JSON.stringify({ err: "Invalid token format" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      email = tokenEmail;
    }

    const { name, context } = await req.json();
    await createChatbot({ name, context, email });
    return new Response(
      JSON.stringify({ message: "chatbot created successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.log(err);
    
    if (err.code === 11000) {
      return new Response(
        JSON.stringify({ err: "A chatbot with this name already exists. Please choose a different name." }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}