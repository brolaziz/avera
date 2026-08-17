import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: "default" } });
  }

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      heroTitle: body.heroTitle,
      heroDiscount: body.heroDiscount,
      freeDeliveryMin: body.freeDeliveryMin,
      contactPhone: body.contactPhone,
      telegram: body.telegram,
      instagram: body.instagram,
    },
    create: {
      id: "default",
      heroTitle: body.heroTitle,
      heroDiscount: body.heroDiscount,
      freeDeliveryMin: body.freeDeliveryMin,
      contactPhone: body.contactPhone,
      telegram: body.telegram,
      instagram: body.instagram,
    },
  });

  return NextResponse.json(settings);
}
