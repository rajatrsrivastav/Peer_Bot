import { getChatbotByName, verifyToken } from "../../utils";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await auth();
    const isAuthenticated = !!session?.user?.email;

    if (!isAuthenticated) {
      const authHeader = req.headers.get("authorization");
      const accessToken = authHeader?.split(" ")[1];

      if (!accessToken || !(await verifyToken(accessToken))) {
        return new Response(JSON.stringify({ err: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return new Response(JSON.stringify({ err: "Name query param missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await getChatbotByName(name);

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
