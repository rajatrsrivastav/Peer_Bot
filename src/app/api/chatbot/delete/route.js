import { createConnection } from "@/config/db";
import { verifyToken } from "../../utils";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import ChatBot from "@/models/chatbots";
await createConnection();

export async function DELETE(req) {
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

    const { name } = await req.json();
    
    if (!name) {
      return new Response(JSON.stringify({ err: "Chatbot name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chatbot = await ChatBot.findOne({ name, creator: email });
    
    if (!chatbot) {
      return new Response(
        JSON.stringify({ err: "Chatbot not found or you don't have permission to delete it" }), 
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await ChatBot.deleteOne({ name, creator: email });
    
    return new Response(
      JSON.stringify({ message: "Chatbot deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
