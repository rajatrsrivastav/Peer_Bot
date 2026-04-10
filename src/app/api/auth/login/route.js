import bcrypt from "bcrypt";
import User from "@/models/user";
import Token from "@/models/token";
import { createConnection } from "@/config/db";
import { z } from "zod";
import jwt from "jsonwebtoken"
await createConnection();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse({ email: body.email, password: body.password });

    if (!result.success) {
      return new Response(JSON.stringify({ err: result.error.errors[0].message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email, password } = result.data;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(JSON.stringify({ err: "User does not exist" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ err: "Password does not match" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = await registerToken(email);
    return new Response(
      JSON.stringify({ token, message: "User logged in successfully" }),
      {
        status: 201,
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

const registerToken = async (email) => {
  const token = new Date().toISOString() + "#@#" + email;
  const newToken = new Token({ token });
  return newToken.save();
};
