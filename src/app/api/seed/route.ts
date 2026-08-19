import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const CATEGORIES = [
  { name: "Sumkalar", slug: "sumkalar", order: 1 },
  { name: "Ryukzaklar", slug: "ryukzaklar", order: 2 },
  { name: "Hamyonlar", slug: "hamyonlar", order: 3 },
  { name: "Chegirmalar", slug: "chegirmalar", order: 4 },
];

const FOOTER = [
  {
    title: "Do'kon",
    links: [
      { label: "Sumkalar", url: "/katalog?category=sumkalar" },
      { label: "Ryukzaklar", url: "/katalog?category=ryukzaklar" },
      { label: "Hamyonlar", url: "/katalog?category=hamyonlar" },
      { label: "Chegirmalar", url: "/katalog?category=chegirmalar" },
    ],
  },
  {
    title: "Yordam",
    links: [
      { label: "Yetkazib berish", url: "#" },
      { label: "Qaytarish", url: "#" },
      { label: "O'lcham jadvali", url: "#" },
      { label: "Savol-javob", url: "#" },
    ],
  },
  {
    title: "Kompaniya",
    links: [
      { label: "Biz haqimizda", url: "#" },
      { label: "Do'konlar", url: "#" },
      { label: "Hamkorlik", url: "/hamkorlik" },
      { label: "Aloqa", url: "/aloqa" },
    ],
  },
];

export async function POST(request: Request) {
  const url = new URL(request.url);
  const withDemoProducts = url.searchParams.get("demo") === "1";

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  // Footer strukturasi faqat bo'sh bo'lsa yaratiladi — admin o'zgartirishlari yo'qolmasin.
  if ((await prisma.footerSection.count()) === 0) {
    for (const [i, section] of FOOTER.entries()) {
      await prisma.footerSection.create({
        data: {
          title: section.title,
          order: i,
          links: { create: section.links.map((l, j) => ({ label: l.label, url: l.url, order: j })) },
        },
      });
    }
  }

  await prisma.paymentSettings.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });
  await prisma.siteSettings.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });

  if (withDemoProducts) {
    await seedDemoProducts();
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "ADMIN_EMAIL va ADMIN_PASSWORD environment variable sifatida o'rnatilishi shart",
      },
      { status: 400 }
    );
  }

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashPassword(adminPassword) },
    create: { email: adminEmail, password: hashPassword(adminPassword), name: "Admin" },
  });

  return NextResponse.json({
    success: true,
    message: withDemoProducts
      ? "Bazaga boshlang'ich ma'lumotlar va namuna mahsulotlar qo'shildi"
      : "Bazaga boshlang'ich ma'lumotlar qo'shildi (mahsulotlarni admin paneldan qo'shing)",
  });
}

/** Namuna mahsulotlar — faqat ?demo=1 bilan chaqirilganda qo'shiladi. */
async function seedDemoProducts() {
  const demo = [
    { slug: "mila-tote", name: "Mila tote", price: 1240000, oldPrice: 1480000, tag: "Yangi", description: "Kundalik ishlatish uchun qulay va chiroyli tote sumka.", stock: 12, category: "sumkalar", colors: [{ name: "Konyak", hex: "#8A5A34" }, { name: "Qora", hex: "#2A211D" }] },
    { slug: "lora-shoulder", name: "Lora shoulder", price: 890000, oldPrice: 1050000, tag: "", description: "Yelkaga osiladigan klassik sumka.", stock: 8, category: "sumkalar", colors: [{ name: "Qora", hex: "#2A211D" }] },
    { slug: "nora-mini", name: "Nora mini", price: 720000, oldPrice: null, tag: "Hit", description: "Kichik va oqlangan mini sumka.", stock: 15, category: "sumkalar", colors: [{ name: "Krem", hex: "#E7DCC9" }] },
    { slug: "aziza-backpack", name: "Aziza ryukzak", price: 940000, oldPrice: 1120000, tag: "", description: "Kundalik foydalanish uchun charm ryukzak.", stock: 10, category: "ryukzaklar", colors: [{ name: "Zaytun", hex: "#5C6B4A" }] },
    { slug: "kamila-wallet", name: "Kamila hamyon", price: 340000, oldPrice: null, tag: "", description: "Ixcham charm hamyon.", stock: 22, category: "hamyonlar", colors: [{ name: "Bordo", hex: "#6B1E2E" }] },
  ];

  for (const p of demo) {
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
        description: p.description,
        stock: p.stock,
        colors: p.colors,
        specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "Kafolat", v: "2 yil" }],
        categoryId: cat?.id || null,
      },
    });
  }
}
