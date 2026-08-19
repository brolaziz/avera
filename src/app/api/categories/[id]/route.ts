import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      order: body.order ?? undefined,
      visible: body.visible ?? undefined,
    },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({
    id: category.id,
    name: category.name,
    slug: category.slug,
    order: category.order,
    visible: category.visible,
    productCount: category._count.products,
  });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;

  // Kategoriya o'chirilsa, mahsulotlar yo'qolmasin — ular kategoriyasiz qoladi.
  await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
