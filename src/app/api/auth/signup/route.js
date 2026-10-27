import User from "@/models/user";
import { createConnection } from "@/config/db";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req) {
  try {
    await createConnection();
    const body = await req.json();
    const result = signupSchema.safeParse({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ message: result.error.issues[0].message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const user = new User({ name, email, password });

    const savedUser = await user.save();

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      }),
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
