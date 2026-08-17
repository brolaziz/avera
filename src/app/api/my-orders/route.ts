import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Telefon raqam kerak" }, { status: 400 });
  }

  const orders = await prisma.order.findMany({
    where: { phone },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    orders.map((o) => ({
      id: o.id,
      customer: o.customer,
      phone: o.phone,
      address: o.address,
      items: o.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total: o.total,
      status: o.status,
      date: o.createdAt.toISOString().split("T")[0],
    }))
  );
}
