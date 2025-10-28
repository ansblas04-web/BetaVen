import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // Ensure user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return success - the signin page will handle the actual signIn call
    return new Response(JSON.stringify({ success: true, email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Dev login error:", error);
    return new Response(JSON.stringify({ error: "Login failed" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
