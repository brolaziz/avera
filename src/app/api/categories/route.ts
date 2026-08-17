import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, order: c.order }))
  );
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: "Nom va slug kerak" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      order: body.order || 0,
    },
  });

  return NextResponse.json({ id: category.id, name: category.name, slug: category.slug, order: category.order }, { status: 201 });
}
