import { createConnection } from "@/config/db";
import { verifyToken } from "../../utils";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import ChatBot from "@/models/chatbots";
await createConnection();

export async function PUT(req) {
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

    const { name, newName, context } = await req.json();
    
    if (!name) {
      return new Response(JSON.stringify({ err: "Chatbot name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chatbot = await ChatBot.findOne({ name, creator: email });
    
    if (!chatbot) {
      return new Response(
        JSON.stringify({ err: "Chatbot not found or you don't have permission to update it" }), 
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updateData = {};
    if (newName && newName !== name) {
      const existingBot = await ChatBot.findOne({ name: newName });
      if (existingBot) {
        return new Response(
          JSON.stringify({ err: "A chatbot with this name already exists" }), 
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      updateData.name = newName;
    }
    if (context !== undefined) {
      updateData.context = context;
    }

    await ChatBot.updateOne({ name, creator: email }, updateData);
    
    return new Response(
      JSON.stringify({ message: "Chatbot updated successfully", chatbot: { ...chatbot._doc, ...updateData } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
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
