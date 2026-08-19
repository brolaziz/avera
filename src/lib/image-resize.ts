const MAX_EDGE = 1600;
const QUALITY = 0.86;

/**
 * Yuklashdan oldin rasmni brauzerda kichraytiradi va WebP'ga o'giradi.
 * Shu tufayli bazaga ham, mijoz telefoniga ham ortiqcha katta fayl bormaydi.
 * Biror bosqich ishlamasa, asl fayl o'zgarishsiz qaytariladi.
 */
export async function optimizeImage(file: File): Promise<File> {
  // GIF animatsiyasi canvas orqali o'tkazilsa buziladi — unga tegilmaydi.
  if (file.type === "image/gif" || typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

    // Kichik va allaqachon ixcham rasmni qayta siqishning hojati yo'q.
    if (scale === 1 && file.size <= 400 * 1024) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY)
    );

    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}
