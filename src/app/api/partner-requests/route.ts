import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const requests = await prisma.partnerRequest.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json(
    requests.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      telegram: r.telegram,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}

/** Hamkorlik formasi — ochiq endpoint, mijoz sayti to'ldiradi. */
export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "Ism va telefon raqami kerak" }, { status: 400 });
  }

  const created = await prisma.partnerRequest.create({
    data: {
      name: name.slice(0, 120),
      phone: phone.slice(0, 40),
      telegram: String(body.telegram || "").trim().slice(0, 80),
      message: String(body.message || "").trim().slice(0, 2000),
    },
  });

  return NextResponse.json({ id: created.id, success: true }, { status: 201 });
}
