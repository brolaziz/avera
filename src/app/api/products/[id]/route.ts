import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    slug: product.slug,
    name: product.name,
    color: (product.colors as { name: string; hex: string }[])[0]?.name || "",
    price: formatPrice(product.price),
    priceNum: product.price,
    oldPrice: product.oldPrice ? formatPrice(product.oldPrice) : "",
    oldPriceNum: product.oldPrice,
    tag: product.tag,
    colors: product.colors,
    specs: product.specs,
    image: product.image,
    description: product.description,
    stock: product.stock,
    category: product.category?.name || "",
    createdAt: product.createdAt.toISOString().split("T")[0],
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  let categoryId: string | null = null;
  if (body.category) {
    const cat = await prisma.category.findFirst({ where: { name: body.category } });
    if (cat) categoryId = cat.id;
  }

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
      stock: body.stock || 0,
      colors: body.colors || [],
      specs: body.specs || [],
      categoryId,
    },
  });

  return NextResponse.json(product);
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

function formatPrice(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
