import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const validStatuses = ["kutilmoqda", "tolangan", "yolda", "bekor"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });

  return NextResponse.json({
    id: order.id,
    customer: order.customer,
    phone: order.phone,
    address: order.address,
    items: order.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    total: order.total,
    status: order.status,
    date: order.createdAt.toISOString().split("T")[0],
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    customer: order.customer,
    phone: order.phone,
    address: order.address,
    items: order.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    total: order.total,
    status: order.status,
    date: order.createdAt.toISOString().split("T")[0],
  });
}
