import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  // Seed categories
  const categories = [
    { name: "Tote", slug: "tote", order: 1 },
    { name: "Crossbody", slug: "crossbody", order: 2 },
    { name: "Clutch", slug: "clutch", order: 3 },
    { name: "Ryukzak", slug: "ryukzak", order: 4 },
    { name: "Hamyon", slug: "hamyon", order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Seed products
  const productData = [
    { slug: "mila-tote", name: "Mila tote", price: 1240000, oldPrice: 1480000, tag: "Yangi", image: "", description: "Kundalik ishlatish uchun qulay va chiroyli tote sumka. Tabiiy charm materialdan tayyorlangan.", stock: 12, category: "tote", colors: [{ name: "Konyak", hex: "#8A5A34" }, { name: "Qora", hex: "#2B1F17" }, { name: "Krem", hex: "#E7DCC9" }, { name: "Zaytun", hex: "#5C6B4A" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "34 × 28 × 12 sm" }, { k: "Ichki cho'ntak", v: "3 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "lora-shoulder", name: "Lora shoulder", price: 890000, oldPrice: 1050000, tag: "-15%", image: "", description: "Yelkaga osiladigan klassik sumka. Har qanday kiyim bilan mos keladi.", stock: 8, category: "crossbody", colors: [{ name: "Qora", hex: "#2B1F17" }, { name: "Konyak", hex: "#8A5A34" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "30 × 22 × 8 sm" }, { k: "Ichki cho'ntak", v: "2 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "nora-mini", name: "Nora mini", price: 720000, oldPrice: 820000, tag: "Hit", image: "", description: "Kichik va oqlangan mini sumka. Bayram kechalarida ideal.", stock: 15, category: "clutch", colors: [{ name: "Krem", hex: "#E7DCC9" }, { name: "Pudra", hex: "#C98B93" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "22 × 16 × 8 sm" }, { k: "Ichki cho'ntak", v: "2 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "aziza-crossbody", name: "Aziza crossbody", price: 640000, oldPrice: 760000, tag: "-20%", image: "", description: "Yelka orqali tashiladigan qulay crossbody sumka.", stock: 20, category: "crossbody", colors: [{ name: "Zaytun", hex: "#5C6B4A" }, { name: "Qora", hex: "#2B1F17" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "24 × 18 × 6 sm" }, { k: "Ichki cho'ntak", v: "1 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "sara-hobo", name: "Sara hobo", price: 1090000, oldPrice: 1260000, tag: "Yangi", image: "", description: "Katta hajmli hobo sumka. Ko'p narsalar sig'adi.", stock: 6, category: "tote", colors: [{ name: "Shokolad", hex: "#5C3A1E" }, { name: "Konyak", hex: "#8A5A34" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "36 × 30 × 14 sm" }, { k: "Ichki cho'ntak", v: "3 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "dilnoza-baguette", name: "Dilnoza baguette", price: 580000, oldPrice: 690000, tag: "-10%", image: "", description: "Zamonaviy baguette shaklidagi sumka.", stock: 10, category: "crossbody", colors: [{ name: "Pudra", hex: "#C98B93" }, { name: "Krem", hex: "#E7DCC9" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "28 × 14 × 6 sm" }, { k: "Ichki cho'ntak", v: "1 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "rayhon-bucket", name: "Rayhon bucket", price: 760000, oldPrice: 890000, tag: "Hit", image: "", description: "Bucket shaklidagi original sumka.", stock: 9, category: "tote", colors: [{ name: "Qumrang", hex: "#8A7A5A" }, { name: "Qora", hex: "#2B1F17" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "26 × 24 × 14 sm" }, { k: "Ichki cho'ntak", v: "2 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "kamila-clutch", name: "Kamila clutch", price: 460000, oldPrice: 540000, tag: "-15%", image: "", description: "Elegant lak charm clutch. Maxsus tadbirlar uchun.", stock: 14, category: "clutch", colors: [{ name: "Qora lak", hex: "#2B1F17" }, { name: "Konyak", hex: "#8A5A34" }], specs: [{ k: "Material", v: "Lak charm" }, { k: "O'lchami", v: "26 × 14 × 4 sm" }, { k: "Ichki cho'ntak", v: "1 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "zuhra-satchel", name: "Zuhra satchel", price: 980000, oldPrice: 1140000, tag: "Yangi", image: "", description: "Klassik satchel sumka. Ish va dam olish uchun qulay.", stock: 7, category: "tote", colors: [{ name: "Konyak", hex: "#8A5A34" }, { name: "Zaytun", hex: "#5C6B4A" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "32 × 24 × 10 sm" }, { k: "Ichki cho'ntak", v: "3 ta" }, { k: "Kafolat", v: "2 yil" }] },
  ];

  for (const p of productData) {
    const cat = await prisma.category.findUnique({ where: { slug: p.category } });
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        tag: p.tag,
        image: p.image,
        description: p.description,
        stock: p.stock,
        colors: p.colors,
        specs: p.specs,
        categoryId: cat?.id || null,
      },
    });
  }

  // Seed payment settings
  await prisma.paymentSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  // Seed site settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  // Seed admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@avera.uz";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashPassword(adminPassword),
      name: "Admin",
    },
  });

  return NextResponse.json({ success: true, message: "Bazaga boshlang'ich ma'lumotlar qo'shildi" });
}
