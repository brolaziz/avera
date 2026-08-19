import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";
import { resolveCategoryId } from "@/lib/db-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
  }

  return NextResponse.json(serializeProduct(product));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const categoryId = await resolveCategoryId(body);

  const product = await prisma.product.update({
    where: { id },
    data: {
      slug: body.slug,
      name: body.name,
      description: body.description || "",
      price: body.priceNum || body.price,
      oldPrice: body.oldPriceNum || null,
      tag: body.tag || "",
      image: body.image || "",
      images: body.images || [],
      stock: body.stock || 0,
      available: body.available ?? true,
      colors: body.colors || [],
      specs: body.specs || [],
      categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json(serializeProduct(product));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
