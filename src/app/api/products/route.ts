import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { serializeProduct, generateSlug } from "@/lib/serialize";
import { resolveCategoryId } from "@/lib/db-helpers";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(serializeProduct));
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();

  const categoryId = await resolveCategoryId(body);

  const product = await prisma.product.create({
    data: {
      slug: body.slug || generateSlug(body.name),
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

  return NextResponse.json(serializeProduct(product), { status: 201 });
}
