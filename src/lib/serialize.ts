import type { Prisma } from "@/generated/prisma/client";

export function formatPrice(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

/** Bitta joyda — mahsulotning API ko'rinishi. Frontend shu shaklga tayanadi. */
export function serializeProduct(p: ProductWithCategory) {
  const images = Array.isArray(p.images) ? (p.images as string[]).filter(Boolean) : [];
  const gallery = p.image ? [p.image, ...images.filter((i) => i !== p.image)] : images;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    color: (p.colors as { name: string; hex: string }[])[0]?.name || "",
    price: formatPrice(p.price),
    priceNum: p.price,
    oldPrice: p.oldPrice ? formatPrice(p.oldPrice) : "",
    oldPriceNum: p.oldPrice ?? undefined,
    discount: p.oldPrice && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : 0,
    tag: p.tag,
    colors: p.colors as { name: string; hex: string }[],
    specs: p.specs as { k: string; v: string }[],
    image: gallery[0] || "",
    images: gallery,
    description: p.description,
    stock: p.stock,
    // `available` — adminning holati; `inStock` — mijoz sotib ola oladimi.
    available: p.available,
    inStock: p.available && p.stock > 0,
    categoryId: p.categoryId ?? "",
    category: p.category?.name || "",
    categorySlug: p.category?.slug || "",
    createdAt: p.createdAt.toISOString().split("T")[0],
  };
}
