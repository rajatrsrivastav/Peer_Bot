import User from "@/models/user";
import { createConnection } from "@/config/db";
import { z } from "zod";

await createConnection();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse({ email: body.email, password: body.password });

    if (!result.success) {
      return new Response(
        JSON.stringify({ message: result.error.errors[0].message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { email, password } = result.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(
        JSON.stringify(JSON.stringify({ message: "User already exists" })),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const user = new User({ email, password });

    const savedUser = await user.save();

    return new Response(
      JSON.stringify({ message: "User created successfully", user: savedUser }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error during user registration:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
