import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fayl yuborilmadi" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Faqat JPG, PNG, WEBP, AVIF yoki GIF rasm yuklash mumkin" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Rasm hajmi 4 MB dan oshmasligi kerak" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const media = await prisma.media.create({
    data: { mimeType: file.type, size: bytes.length, data: bytes },
    select: { id: true, mimeType: true, size: true },
  });

  return NextResponse.json({ id: media.id, url: `/api/media/${media.id}`, mimeType: media.mimeType, size: media.size }, { status: 201 });
}
