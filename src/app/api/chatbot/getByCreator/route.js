import { createConnection } from "@/config/db";
import { getChatbotByCreator, verifyToken } from "../../utils";
import { auth } from "@/app/api/auth/[...nextauth]/route";
await createConnection();

export async function GET(req) {
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

    const data = await getChatbotByCreator(email);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
