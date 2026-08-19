import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

interface LinkInput {
  label: string;
  url?: string;
  visible?: boolean;
}

interface SectionInput {
  title: string;
  visible?: boolean;
  links?: LinkInput[];
}

export async function GET(request: Request) {
  // `?all=1` — admin paneldagi to'liq ro'yxat; parametrsiz — mijoz sayti ko'radigan qism.
  const includeHidden = new URL(request.url).searchParams.get("all") === "1";
  const admin = includeHidden ? await getAdminFromRequest(request) : null;

  const sections = await prisma.footerSection.findMany({
    where: admin ? undefined : { visible: true },
    orderBy: { order: "asc" },
    include: {
      links: {
        where: admin ? undefined : { visible: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(
    sections.map((s) => ({
      id: s.id,
      title: s.title,
      order: s.order,
      visible: s.visible,
      links: s.links.map((l) => ({
        id: l.id,
        label: l.label,
        url: l.url,
        order: l.order,
        visible: l.visible,
      })),
    }))
  );
}

/** Butun footer strukturasi bir marotaba almashtiriladi — admin formasi shu shaklda saqlaydi. */
export async function PUT(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();
  const sections: SectionInput[] = Array.isArray(body.sections) ? body.sections : [];

  await prisma.$transaction(async (tx) => {
    await tx.footerSection.deleteMany({});
    for (const [i, section] of sections.entries()) {
      if (!section.title?.trim()) continue;
      await tx.footerSection.create({
        data: {
          title: section.title.trim(),
          order: i,
          visible: section.visible ?? true,
          links: {
            create: (section.links || [])
              .filter((l) => l.label?.trim())
              .map((l, j) => ({
                label: l.label.trim(),
                url: l.url?.trim() || "#",
                order: j,
                visible: l.visible ?? true,
              })),
          },
        },
      });
    }
  });

  const saved = await prisma.footerSection.findMany({
    orderBy: { order: "asc" },
    include: { links: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(saved);
}
