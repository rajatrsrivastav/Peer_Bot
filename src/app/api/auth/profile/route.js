import User from "@/models/user";
import Token from "@/models/token";
import { createConnection } from "@/config/db";
import jwt from "jsonwebtoken";

await createConnection();

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ err: "No token provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.substring(7);


    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      return new Response(JSON.stringify({ err: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const email = token.split('#@#')[1];
    if (!email) {
      return new Response(JSON.stringify({ err: "Invalid token format" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await User.findOne({ email }).select('name email image');
    if (!user) {
      return new Response(JSON.stringify({ err: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        user: {
          name: user.name || user.email.split('@')[0],
          email: user.email,
          image: user.image
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}