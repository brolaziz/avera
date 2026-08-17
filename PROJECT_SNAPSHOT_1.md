# AVERA — E-Commerce Loyiha To'liq Snapshot

> **Maqsad:** Bu hujjat AVERA loyihasini boshqa muhitda noldan qayta qurish uchun yetarli ma'lumot beradi.
> **Sana:** 2026-08-17
> **Stack:** Next.js 16 + Prisma 7 + PostgreSQL + Tailwind CSS 4

---

## 1. Loyiha Strukturasi (Fayl Daraxti)

```
sumkaxona/
├── prisma/
│   └── schema.prisma           # Database schema
├── prisma.config.ts            # Prisma configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, providers)
│   │   ├── page.tsx            # Bosh sahifa
│   │   ├── globals.css         # Global CSS + Tailwind
│   │   ├── katalog/
│   │   │   └── page.tsx        # Katalog sahifasi
│   │   ├── mahsulot/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Mahsulot tafsilot sahifasi
│   │   ├── savat/
│   │   │   └── page.tsx        # Savat sahifasi
│   │   ├── checkout/
│   │   │   └── page.tsx        # To'lov sahifasi
│   │   ├── qidiruv/
│   │   │   └── page.tsx        # Qidiruv sahifasi
│   │   ├── profil/
│   │   │   └── page.tsx        # Profil / Buyurtmalarim
│   │   ├── admin/
│   │   │   ├── layout.tsx      # Admin layout (sidebar, auth gate)
│   │   │   ├── page.tsx        # Admin dashboard
│   │   │   ├── mahsulotlar/
│   │   │   │   ├── page.tsx    # Mahsulotlar ro'yxati
│   │   │   │   ├── yangi/
│   │   │   │   │   └── page.tsx # Yangi mahsulot qo'shish
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Mahsulotni tahrirlash
│   │   │   ├── buyurtmalar/
│   │   │   │   └── page.tsx    # Buyurtmalar boshqaruvi
│   │   │   ├── katalog/
│   │   │   │   └── page.tsx    # Kategoriyalar boshqaruvi
│   │   │   └── sozlamalar/
│   │   │       └── page.tsx    # Sayt sozlamalari
│   │   └── api/
│   │       ├── auth/
│   │       │   └── route.ts    # Admin login
│   │       ├── products/
│   │       │   ├── route.ts    # GET all, POST new
│   │       │   └── [id]/
│   │       │       └── route.ts # GET/PUT/DELETE product
│   │       ├── categories/
│   │       │   ├── route.ts    # GET all, POST new
│   │       │   └── [id]/
│   │       │       └── route.ts # PUT/DELETE category
│   │       ├── orders/
│   │       │   ├── route.ts    # GET all (admin), POST new
│   │       │   └── [id]/
│   │       │       └── route.ts # PATCH status, GET single
│   │       ├── my-orders/
│   │       │   └── route.ts    # GET orders by phone
│   │       ├── settings/
│   │       │   └── route.ts    # GET/PUT site settings
│   │       ├── payment-settings/
│   │       │   └── route.ts    # GET/PUT payment settings
│   │       └── seed/
│   │           └── route.ts    # POST seed database
│   ├── components/
│   │   ├── Header.tsx          # Sayt header (navigation)
│   │   ├── Footer.tsx          # Sayt footer
│   │   ├── ProductCard.tsx     # Mahsulot kartasi
│   │   ├── LayoutShell.tsx     # Layout wrapper (admin vs public)
│   │   ├── ConfirmModal.tsx    # Buyurtma tasdiqlash modali
│   │   ├── LanguageToggle.tsx  # Til o'zgartirish (UZ/EN/RU)
│   │   └── AdminLogin.tsx      # Admin login formi
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # JWT + bcrypt helpers
│   │   ├── api.ts              # Frontend API client + types
│   │   ├── store.tsx           # Public store (cart, products)
│   │   ├── admin-store.tsx     # Admin store (CRUD operations)
│   │   ├── i18n.tsx            # Internationalization (UZ/EN/RU)
│   │   └── data.ts             # Fallback static data + types
│   └── generated/
│       └── prisma/             # Prisma generated client (auto)
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── .env.example
└── prisma.config.ts
```

### Papkalar vazifasi:
- **`src/app/`** — Next.js App Router sahifalari va API route'lar
- **`src/app/api/`** — Backend REST API endpointlari
- **`src/app/admin/`** — Admin panel sahifalari
- **`src/components/`** — Qayta ishlatiladigan UI komponentlar
- **`src/lib/`** — Utility funksiyalar, store'lar, config
- **`src/generated/prisma/`** — Prisma auto-generated client
- **`prisma/`** — Database schema

---

## 2. Texnologik Stack

| Texnologiya | Versiya | Vazifasi |
|-------------|---------|----------|
| Next.js | 16.3.0 | Full-stack React framework |
| React | 19.2.8 | UI library |
| Prisma ORM | 7.9.1 | Database ORM |
| PostgreSQL | — | Ma'lumotlar bazasi |
| @prisma/adapter-pg | 7.9.1 | PostgreSQL driver adapter |
| pg | 8.23.0 | PostgreSQL client |
| Tailwind CSS | 4.x | Styling |
| bcryptjs | 3.0.3 | Parol hashing |
| jsonwebtoken | 9.0.3 | JWT authentication |
| TypeScript | 5.x | Type safety |

---

## 3. package.json

```json
{
  "name": "sumkaxona",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "npx prisma generate && next build",
    "start": "next start",
    "db:migrate": "npx prisma migrate dev",
    "db:push": "npx prisma db push",
    "db:generate": "npx prisma generate",
    "db:seed": "curl -X POST http://localhost:3000/api/seed",
    "postinstall": "npx prisma generate"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.9.1",
    "@prisma/client": "^7.9.1",
    "bcryptjs": "^3.0.3",
    "dotenv": "^17.4.2",
    "jsonwebtoken": "^9.0.3",
    "next": "16.3.0",
    "pg": "^8.23.0",
    "prisma": "^7.9.1",
    "psql": "^0.0.1",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^20",
    "@types/pg": "^8.21.0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 4. .env.example

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sumkaxona?schema=public"

# Auth
JWT_SECRET="change-this-to-a-random-secret-in-production"
ADMIN_EMAIL="admin@avera.uz"
ADMIN_PASSWORD="admin123"
```

---

## 5. Konfiguratsiya Fayllari

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### prisma.config.ts

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

---

## 6. Ma'lumotlar Bazasi (schema.prisma)

### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String   @default("Admin")
  createdAt DateTime @default(now())
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  order    Int       @default(0)
  products Product[]
}

model Product {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String
  description String      @default("")
  price       Int
  oldPrice    Int?
  tag         String      @default("")
  image       String      @default("")
  stock       Int         @default(0)
  colors      Json        @default("[]")
  specs       Json        @default("[]")
  categoryId  String?
  category    Category?   @relation(fields: [categoryId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id        String      @id @default(cuid())
  customer  String
  phone     String
  address   String
  total     Int
  status    String      @default("kutilmoqda")
  items     OrderItem[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String?
  product   Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  name      String
  qty       Int
  price     Int
}

model PaymentSettings {
  id               String @id @default("default")
  cardNumber       String @default("8600 1234 5678 9012")
  cardOwner        String @default("AVERA SHOP")
  telegramUsername String @default("@avera_admin")
}

model SiteSettings {
  id              String @id @default("default")
  heroTitle       String @default("Tabiiy charm sumkalar kolleksiyasi")
  heroDiscount    String @default("20")
  freeDeliveryMin Int    @default(500000)
  contactPhone    String @default("+998 90 123 45 67")
  telegram        String @default("https://t.me/avera")
  instagram       String @default("https://instagram.com/avera")
}
```

---

## 7. API Route Handlers

### src/app/api/auth/route.ts

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email va parol kerak" }, { status: 400 });
  }

  let admin = await prisma.admin.findUnique({ where: { email } });

  // Auto-create admin on first login if env matches
  if (!admin && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    admin = await prisma.admin.create({
      data: {
        email,
        password: hashPassword(password),
        name: "Admin",
      },
    });
  }

  if (!admin || !comparePassword(password, admin.password)) {
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  const token = signToken(admin.id);

  return NextResponse.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
}
```

### src/app/api/products/route.ts

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const formatted = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    color: (p.colors as { name: string; hex: string }[])[0]?.name || "",
    price: formatPrice(p.price),
    priceNum: p.price,
    oldPrice: p.oldPrice ? formatPrice(p.oldPrice) : "",
    tag: p.tag,
    colors: p.colors as { name: string; hex: string }[],
    specs: p.specs as { k: string; v: string }[],
    image: p.image,
    description: p.description,
    stock: p.stock,
    category: p.category?.name || "",
    createdAt: p.createdAt.toISOString().split("T")[0],
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();

  // Find or create category
  let categoryId: string | null = null;
  if (body.category) {
    const cat = await prisma.category.findFirst({ where: { name: body.category } });
    if (cat) categoryId = cat.id;
  }

  const product = await prisma.product.create({
    data: {
      slug: body.slug || generateSlug(body.name),
      name: body.name,
      description: body.description || "",
      price: body.priceNum || body.price,
      oldPrice: body.oldPriceNum || null,
      tag: body.tag || "",
      image: body.image || "",
      stock: body.stock || 0,
      colors: body.colors || [],
      specs: body.specs || [],
      categoryId,
    },
  });

  return NextResponse.json(product, { status: 201 });
}

function formatPrice(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
```

### src/app/api/products/[id]/route.ts

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    slug: product.slug,
    name: product.name,
    color: (product.colors as { name: string; hex: string }[])[0]?.name || "",
    price: formatPrice(product.price),
    priceNum: product.price,
    oldPrice: product.oldPrice ? formatPrice(product.oldPrice) : "",
    oldPriceNum: product.oldPrice,
    tag: product.tag,
    colors: product.colors,
    specs: product.specs,
    image: product.image,
    description: product.description,
    stock: product.stock,
    category: product.category?.name || "",
    createdAt: product.createdAt.toISOString().split("T")[0],
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  let categoryId: string | null = null;
  if (body.category) {
    const cat = await prisma.category.findFirst({ where: { name: body.category } });
    if (cat) categoryId = cat.id;
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      slug: body.slug,
      name: body.name,
      description: body.description || "",
      price: body.priceNum || body.price,
      oldPrice: body.oldPriceNum || null,
      tag: body.tag || "",
      image: body.image || "",
      stock: body.stock || 0,
      colors: body.colors || [],
      specs: body.specs || [],
      categoryId,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

function formatPrice(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
```

### src/app/api/categories/route.ts

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, order: c.order }))
  );
}

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: "Nom va slug kerak" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      order: body.order || 0,
    },
  });

  return NextResponse.json({ id: category.id, name: category.name, slug: category.slug, order: category.order }, { status: 201 });
}
```

### src/app/api/categories/[id]/route.ts

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      order: body.order ?? undefined,
    },
  });

  return NextResponse.json({ id: category.id, name: category.name, slug: category.slug, order: category.order });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
```

### src/app/api/orders/route.ts

```ts
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
```

### src/app/api/orders/[id]/route.ts

```ts
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
```

### src/app/api/my-orders/route.ts

```ts
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
```

### src/app/api/settings/route.ts

```ts
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
```

### src/app/api/payment-settings/route.ts

```ts
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
```

### src/app/api/seed/route.ts

```ts
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
    { slug: "mila-tote", name: "Mila tote", price: 1240000, oldPrice: 1480000, tag: "Yangi", image: "", description: "Kundalik ishlatish uchun qulay va chiroyli tote sumka. Tabiiy charm materialdan tayyorlangan.", stock: 12, category: "tote", colors: [{ name: "Konyak", hex: "#8A5A34" }, { name: "Qora", hex: "#2B1F17" }, { name: "Krem", hex: "#E7DCC9" }, { name: "Zaytun", hex: "#5C6B4A" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "34 x 28 x 12 sm" }, { k: "Ichki cho'ntak", v: "3 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "lora-shoulder", name: "Lora shoulder", price: 890000, oldPrice: 1050000, tag: "-15%", image: "", description: "Yelkaga osiladigan klassik sumka. Har qanday kiyim bilan mos keladi.", stock: 8, category: "crossbody", colors: [{ name: "Qora", hex: "#2B1F17" }, { name: "Konyak", hex: "#8A5A34" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "30 x 22 x 8 sm" }, { k: "Ichki cho'ntak", v: "2 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "nora-mini", name: "Nora mini", price: 720000, oldPrice: 820000, tag: "Hit", image: "", description: "Kichik va oqlangan mini sumka. Bayram kechalarida ideal.", stock: 15, category: "clutch", colors: [{ name: "Krem", hex: "#E7DCC9" }, { name: "Pudra", hex: "#C98B93" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "22 x 16 x 8 sm" }, { k: "Ichki cho'ntak", v: "2 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "aziza-crossbody", name: "Aziza crossbody", price: 640000, oldPrice: 760000, tag: "-20%", image: "", description: "Yelka orqali tashiladigan qulay crossbody sumka.", stock: 20, category: "crossbody", colors: [{ name: "Zaytun", hex: "#5C6B4A" }, { name: "Qora", hex: "#2B1F17" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "24 x 18 x 6 sm" }, { k: "Ichki cho'ntak", v: "1 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "sara-hobo", name: "Sara hobo", price: 1090000, oldPrice: 1260000, tag: "Yangi", image: "", description: "Katta hajmli hobo sumka. Ko'p narsalar sig'adi.", stock: 6, category: "tote", colors: [{ name: "Shokolad", hex: "#5C3A1E" }, { name: "Konyak", hex: "#8A5A34" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "36 x 30 x 14 sm" }, { k: "Ichki cho'ntak", v: "3 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "dilnoza-baguette", name: "Dilnoza baguette", price: 580000, oldPrice: 690000, tag: "-10%", image: "", description: "Zamonaviy baguette shaklidagi sumka.", stock: 10, category: "crossbody", colors: [{ name: "Pudra", hex: "#C98B93" }, { name: "Krem", hex: "#E7DCC9" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "28 x 14 x 6 sm" }, { k: "Ichki cho'ntak", v: "1 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "rayhon-bucket", name: "Rayhon bucket", price: 760000, oldPrice: 890000, tag: "Hit", image: "", description: "Bucket shaklidagi original sumka.", stock: 9, category: "tote", colors: [{ name: "Qumrang", hex: "#8A7A5A" }, { name: "Qora", hex: "#2B1F17" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "26 x 24 x 14 sm" }, { k: "Ichki cho'ntak", v: "2 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "kamila-clutch", name: "Kamila clutch", price: 460000, oldPrice: 540000, tag: "-15%", image: "", description: "Elegant lak charm clutch. Maxsus tadbirlar uchun.", stock: 14, category: "clutch", colors: [{ name: "Qora lak", hex: "#2B1F17" }, { name: "Konyak", hex: "#8A5A34" }], specs: [{ k: "Material", v: "Lak charm" }, { k: "O'lchami", v: "26 x 14 x 4 sm" }, { k: "Ichki cho'ntak", v: "1 ta" }, { k: "Kafolat", v: "2 yil" }] },
    { slug: "zuhra-satchel", name: "Zuhra satchel", price: 980000, oldPrice: 1140000, tag: "Yangi", image: "", description: "Klassik satchel sumka. Ish va dam olish uchun qulay.", stock: 7, category: "tote", colors: [{ name: "Konyak", hex: "#8A5A34" }, { name: "Zaytun", hex: "#5C6B4A" }], specs: [{ k: "Material", v: "Tabiiy charm" }, { k: "O'lchami", v: "32 x 24 x 10 sm" }, { k: "Ichki cho'ntak", v: "3 ta" }, { k: "Kafolat", v: "2 yil" }] },
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
```

---

## 8. Library Fayllari (src/lib/)

### src/lib/prisma.ts

```ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### src/lib/auth.ts

```ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { adminId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string };
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } });
  return admin;
}
```

### src/lib/api.ts

```ts
const BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Server xatolik" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Products
  getProducts: () => request<Product[]>("/products"),
  getProduct: (id: string) => request<Product>(`/products/${id}`),
  createProduct: (data: Partial<Product>) => request<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>) => request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request<{ success: boolean }>(`/products/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => request<Order[]>("/orders"),
  createOrder: (data: { customer: string; phone: string; address: string; items: OrderItemInput[] }) =>
    request<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateOrderStatus: (id: string, status: string) =>
    request<Order>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getMyOrders: (phone: string) => request<Order[]>(`/my-orders?phone=${encodeURIComponent(phone)}`),

  // Categories
  getCategories: () => request<Category[]>("/categories"),
  createCategory: (data: { name: string; slug: string; order?: number }) =>
    request<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: string, data: { name: string; slug: string; order?: number }) =>
    request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: string) => request<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => request<SiteSettings>("/settings"),
  updateSettings: (data: SiteSettings) => request<SiteSettings>("/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Payment
  getPaymentSettings: () => request<PaymentSettingsType>("/payment-settings"),
  updatePaymentSettings: (data: PaymentSettingsType) =>
    request<PaymentSettingsType>("/payment-settings", { method: "PUT", body: JSON.stringify(data) }),

  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; admin: { id: string; email: string; name: string } }>("/auth", { method: "POST", body: JSON.stringify({ email, password }) }),

  // Seed
  seed: () => request<{ success: boolean }>("/seed", { method: "POST" }),
};

// Types matching the API responses
export interface Product {
  id: string;
  slug: string;
  name: string;
  color: string;
  price: string;
  priceNum: number;
  oldPrice: string;
  oldPriceNum?: number;
  tag: string;
  colors: { name: string; hex: string }[];
  specs: { k: string; v: string }[];
  image: string;
  description: string;
  stock: number;
  category: string;
  createdAt: string;
}

export interface OrderItemInput {
  name: string;
  qty: number;
  price: number;
  productId?: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface SiteSettings {
  id: string;
  heroTitle: string;
  heroDiscount: string;
  freeDeliveryMin: number;
  contactPhone: string;
  telegram: string;
  instagram: string;
}

export interface PaymentSettingsType {
  id: string;
  cardNumber: string;
  cardOwner: string;
  telegramUsername: string;
}
```

### src/lib/data.ts

```ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  color: string;
  price: string;
  priceNum: number;
  oldPrice: string;
  tag: string;
  colors: { name: string; hex: string }[];
  specs: { k: string; v: string }[];
  image: string;
  description: string;
  stock: number;
  category: string;
  createdAt: string;
}

export const products: Product[] = [
  { id: "1", slug: "mila-tote", name: "Mila tote", color: "Konyak", price: "1 240 000", priceNum: 1240000, oldPrice: "1 480 000", tag: "Yangi", colors: [{name:"Konyak",hex:"#8A5A34"},{name:"Qora",hex:"#2B1F17"},{name:"Krem",hex:"#E7DCC9"},{name:"Zaytun",hex:"#5C6B4A"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"34 x 28 x 12 sm"},{k:"Ichki cho'ntak",v:"3 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Kundalik ishlatish uchun qulay va chiroyli tote sumka. Tabiiy charm materialdan tayyorlangan.", stock: 12, category: "Tote", createdAt: "2025-01-15" },
  { id: "2", slug: "lora-shoulder", name: "Lora shoulder", color: "Qora", price: "890 000", priceNum: 890000, oldPrice: "1 050 000", tag: "-15%", colors: [{name:"Qora",hex:"#2B1F17"},{name:"Konyak",hex:"#8A5A34"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"30 x 22 x 8 sm"},{k:"Ichki cho'ntak",v:"2 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Yelkaga osiladigan klassik sumka. Har qanday kiyim bilan mos keladi.", stock: 8, category: "Crossbody", createdAt: "2025-01-20" },
  { id: "3", slug: "nora-mini", name: "Nora mini", color: "Krem", price: "720 000", priceNum: 720000, oldPrice: "820 000", tag: "Hit", colors: [{name:"Krem",hex:"#E7DCC9"},{name:"Pudra",hex:"#C98B93"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"22 x 16 x 8 sm"},{k:"Ichki cho'ntak",v:"2 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Kichik va oqlangan mini sumka. Bayram kechalarida ideal.", stock: 15, category: "Clutch", createdAt: "2025-02-01" },
  { id: "4", slug: "aziza-crossbody", name: "Aziza crossbody", color: "Zaytun", price: "640 000", priceNum: 640000, oldPrice: "760 000", tag: "-20%", colors: [{name:"Zaytun",hex:"#5C6B4A"},{name:"Qora",hex:"#2B1F17"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"24 x 18 x 6 sm"},{k:"Ichki cho'ntak",v:"1 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Yelka orqali tashiladigan qulay crossbody sumka.", stock: 20, category: "Crossbody", createdAt: "2025-02-10" },
  { id: "5", slug: "sara-hobo", name: "Sara hobo", color: "Shokolad", price: "1 090 000", priceNum: 1090000, oldPrice: "1 260 000", tag: "Yangi", colors: [{name:"Shokolad",hex:"#5C3A1E"},{name:"Konyak",hex:"#8A5A34"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"36 x 30 x 14 sm"},{k:"Ichki cho'ntak",v:"3 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Katta hajmli hobo sumka. Ko'p narsalar sig'adi.", stock: 6, category: "Tote", createdAt: "2025-02-15" },
  { id: "6", slug: "dilnoza-baguette", name: "Dilnoza baguette", color: "Pudra", price: "580 000", priceNum: 580000, oldPrice: "690 000", tag: "-10%", colors: [{name:"Pudra",hex:"#C98B93"},{name:"Krem",hex:"#E7DCC9"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"28 x 14 x 6 sm"},{k:"Ichki cho'ntak",v:"1 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Zamonaviy baguette shaklidagi sumka.", stock: 10, category: "Crossbody", createdAt: "2025-03-01" },
  { id: "7", slug: "rayhon-bucket", name: "Rayhon bucket", color: "Qumrang", price: "760 000", priceNum: 760000, oldPrice: "890 000", tag: "Hit", colors: [{name:"Qumrang",hex:"#8A7A5A"},{name:"Qora",hex:"#2B1F17"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"26 x 24 x 14 sm"},{k:"Ichki cho'ntak",v:"2 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Bucket shaklidagi original sumka.", stock: 9, category: "Tote", createdAt: "2025-03-10" },
  { id: "8", slug: "kamila-clutch", name: "Kamila clutch", color: "Qora lak", price: "460 000", priceNum: 460000, oldPrice: "540 000", tag: "-15%", colors: [{name:"Qora lak",hex:"#2B1F17"},{name:"Konyak",hex:"#8A5A34"}], specs: [{k:"Material",v:"Lak charm"},{k:"O'lchami",v:"26 x 14 x 4 sm"},{k:"Ichki cho'ntak",v:"1 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Elegant lak charm clutch. Maxsus tadbirlar uchun.", stock: 14, category: "Clutch", createdAt: "2025-03-20" },
  { id: "9", slug: "zuhra-satchel", name: "Zuhra satchel", color: "Konyak", price: "980 000", priceNum: 980000, oldPrice: "1 140 000", tag: "Yangi", colors: [{name:"Konyak",hex:"#8A5A34"},{name:"Zaytun",hex:"#5C6B4A"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"32 x 24 x 10 sm"},{k:"Ichki cho'ntak",v:"3 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Klassik satchel sumka. Ish va dam olish uchun qulay.", stock: 7, category: "Tote", createdAt: "2025-04-01" },
];

export const reviews = [
  { initial: "SA", name: "Sevinch A.", text: "Charmi juda sifatli, rasmdagidan ham chiroyli. Yetkazish bir kunda bo'ldi." },
  { initial: "NR", name: "Nilufar R.", text: "Noutbukim bemalol sig'adi, ish uchun ideal. Tutqichi qo'lni qiynamaydi." },
  { initial: "GM", name: "Gulnora M.", text: "Rangi ozgina to'qroq chiqdi, lekin umumiy taassurot juda yaxshi." },
];
```
