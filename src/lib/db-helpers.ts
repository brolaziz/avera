import { prisma } from "./prisma";

/** Kategoriya id, slug yoki nom bo'yicha topiladi — admin panel har uchalasini yubora oladi. */
export async function resolveCategoryId(body: { categoryId?: string; category?: string }) {
  if (body.categoryId) {
    const byId = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (byId) return byId.id;
  }
  if (body.category) {
    const byName = await prisma.category.findFirst({
      where: { OR: [{ name: body.category }, { slug: body.category }] },
    });
    if (byName) return byName.id;
  }
  return null;
}
