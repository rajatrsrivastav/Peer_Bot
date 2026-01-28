import { createConnection } from "@/config/db";
import Token from "@/models/token";
await createConnection();

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ err: "Token is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await Token.deleteOne({ token });

    if (result.deletedCount === 0) {
      console.warn(`Token not found in database: ${token.substring(0, 20)}...`);
    }

    return new Response(
      JSON.stringify({ message: "User logged out successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during logout:", error);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
