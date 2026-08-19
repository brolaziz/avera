import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { generateSlug } from "@/lib/serialize";

export async function GET(request: Request) {
  // Admin panel `?all=1` bilan yashirilganlarni ham so'raydi; mijoz sayti — faqat ko'rinadiganlarni.
  // Ro'yxatni tokenga emas, aniq so'rovga bog'lash admin brauzerida ham saytni to'g'ri ko'rsatadi.
  const includeHidden = new URL(request.url).searchParams.get("all") === "1";
  const admin = includeHidden ? await getAdminFromRequest(request) : null;

  const categories = await prisma.category.findMany({
    where: admin ? undefined : { visible: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json(
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      order: c.order,
      visible: c.visible,
      productCount: c._count.products,
    }))
  );
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "Nom kerak" }, { status: 400 });
  }

  const slug = body.slug || generateSlug(body.name);
  if (!slug) {
    return NextResponse.json({ error: "Slug yaratib bo'lmadi, uni qo'lda kiriting" }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Bu slug allaqachon band" }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug,
      order: body.order ?? 0,
      visible: body.visible ?? true,
    },
  });

  return NextResponse.json(
    { id: category.id, name: category.name, slug: category.slug, order: category.order, visible: category.visible, productCount: 0 },
    { status: 201 }
  );
}
