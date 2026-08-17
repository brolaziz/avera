import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email va parol kerak" }, { status: 400 });
  }

  let admin = await prisma.admin.findUnique({ where: { email } });

  // Auto-create admin on first login if env matches
  if (!admin && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    admin = await prisma.admin.create({
      data: {
        email,
        password: hashPassword(password),
        name: "Admin",
      },
    });
  }

  if (!admin || !comparePassword(password, admin.password)) {
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  const token = signToken(admin.id);

  return NextResponse.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
}
