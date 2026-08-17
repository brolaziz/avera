import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const formatted = orders.map((o) => ({
    id: o.id,
    customer: o.customer,
    phone: o.phone,
    address: o.address,
    items: o.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    total: o.total,
    status: o.status,
    date: o.createdAt.toISOString().split("T")[0],
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.customer || !body.phone || !body.address || !body.items?.length) {
    return NextResponse.json({ error: "Barcha maydonlar kerak" }, { status: 400 });
  }

  const total = body.items.reduce(
    (sum: number, item: { price: number; qty: number }) => sum + item.price * item.qty,
    0
  );

  const order = await prisma.order.create({
    data: {
      customer: body.customer,
      phone: body.phone,
      address: body.address,
      total,
      status: "kutilmoqda",
      items: {
        create: body.items.map((item: { name: string; qty: number; price: number; productId?: string }) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          productId: item.productId || null,
        })),
      },
    },
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
  }, { status: 201 });
}
