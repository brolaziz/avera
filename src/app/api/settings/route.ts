import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

const FIELDS = [
  "heroBadge",
  "heroTitle",
  "heroSubtitle",
  "heroDiscount",
  "heroImage",
  "heroCtaText",
  "heroCtaLink",
  "featuredTitle",
  "contactPhone",
  "telegram",
  "instagram",
  "address",
  "workHours",
  "footerAbout",
] as const;

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();

  // Faqat yuborilgan maydonlar yangilanadi — qolganlari tegilmaydi.
  const data: Record<string, string | number> = {};
  for (const key of FIELDS) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  if (body.freeDeliveryMin !== undefined && body.freeDeliveryMin !== null) {
    data.freeDeliveryMin = Number(body.freeDeliveryMin) || 0;
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json(settings);
}
