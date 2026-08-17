import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET() {
  let payment = await prisma.paymentSettings.findUnique({ where: { id: "default" } });

  if (!payment) {
    payment = await prisma.paymentSettings.create({ data: { id: "default" } });
  }

  return NextResponse.json(payment);
}

export async function PUT(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();

  const payment = await prisma.paymentSettings.upsert({
    where: { id: "default" },
    update: {
      cardNumber: body.cardNumber,
      cardOwner: body.cardOwner,
      telegramUsername: body.telegramUsername,
    },
    create: {
      id: "default",
      cardNumber: body.cardNumber,
      cardOwner: body.cardOwner,
      telegramUsername: body.telegramUsername,
    },
  });

  return NextResponse.json(payment);
}
