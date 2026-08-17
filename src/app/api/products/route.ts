import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const formatted = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    color: (p.colors as { name: string; hex: string }[])[0]?.name || "",
    price: formatPrice(p.price),
    priceNum: p.price,
    oldPrice: p.oldPrice ? formatPrice(p.oldPrice) : "",
    tag: p.tag,
    colors: p.colors as { name: string; hex: string }[],
    specs: p.specs as { k: string; v: string }[],
    image: p.image,
    description: p.description,
    stock: p.stock,
    category: p.category?.name || "",
    createdAt: p.createdAt.toISOString().split("T")[0],
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();

  // Find or create category
  let categoryId: string | null = null;
  if (body.category) {
    const cat = await prisma.category.findFirst({ where: { name: body.category } });
    if (cat) categoryId = cat.id;
  }

  const product = await prisma.product.create({
    data: {
      slug: body.slug || generateSlug(body.name),
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

  return NextResponse.json(product, { status: 201 });
}

function formatPrice(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
