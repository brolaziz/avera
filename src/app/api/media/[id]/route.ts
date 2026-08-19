import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Rasm topilmadi" }, { status: 404 });
  }

  // Rasm mazmuni o'zgarmaydi (yangi yuklash = yangi id), shuning uchun uzoq keshlanadi.
  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": String(media.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
