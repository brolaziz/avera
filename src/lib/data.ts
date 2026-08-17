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
  { id: "1", slug: "mila-tote", name: "Mila tote", color: "Konyak", price: "1 240 000", priceNum: 1240000, oldPrice: "1 480 000", tag: "Yangi", colors: [{name:"Konyak",hex:"#8A5A34"},{name:"Qora",hex:"#2B1F17"},{name:"Krem",hex:"#E7DCC9"},{name:"Zaytun",hex:"#5C6B4A"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"34 × 28 × 12 sm"},{k:"Ichki cho'ntak",v:"3 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Kundalik ishlatish uchun qulay va chiroyli tote sumka. Tabiiy charm materialdan tayyorlangan.", stock: 12, category: "Tote", createdAt: "2025-01-15" },
  { id: "2", slug: "lora-shoulder", name: "Lora shoulder", color: "Qora", price: "890 000", priceNum: 890000, oldPrice: "1 050 000", tag: "-15%", colors: [{name:"Qora",hex:"#2B1F17"},{name:"Konyak",hex:"#8A5A34"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"30 × 22 × 8 sm"},{k:"Ichki cho'ntak",v:"2 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Yelkaga osiladigan klassik sumka. Har qanday kiyim bilan mos keladi.", stock: 8, category: "Crossbody", createdAt: "2025-01-20" },
  { id: "3", slug: "nora-mini", name: "Nora mini", color: "Krem", price: "720 000", priceNum: 720000, oldPrice: "820 000", tag: "Hit", colors: [{name:"Krem",hex:"#E7DCC9"},{name:"Pudra",hex:"#C98B93"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"22 × 16 × 8 sm"},{k:"Ichki cho'ntak",v:"2 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Kichik va oqlangan mini sumka. Bayram kechalarida ideal.", stock: 15, category: "Clutch", createdAt: "2025-02-01" },
  { id: "4", slug: "aziza-crossbody", name: "Aziza crossbody", color: "Zaytun", price: "640 000", priceNum: 640000, oldPrice: "760 000", tag: "-20%", colors: [{name:"Zaytun",hex:"#5C6B4A"},{name:"Qora",hex:"#2B1F17"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"24 × 18 × 6 sm"},{k:"Ichki cho'ntak",v:"1 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Yelka orqali tashiladigan qulay crossbody sumka.", stock: 20, category: "Crossbody", createdAt: "2025-02-10" },
  { id: "5", slug: "sara-hobo", name: "Sara hobo", color: "Shokolad", price: "1 090 000", priceNum: 1090000, oldPrice: "1 260 000", tag: "Yangi", colors: [{name:"Shokolad",hex:"#5C3A1E"},{name:"Konyak",hex:"#8A5A34"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"36 × 30 × 14 sm"},{k:"Ichki cho'ntak",v:"3 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Katta hajmli hobo sumka. Ko'p narsalar sig'adi.", stock: 6, category: "Tote", createdAt: "2025-02-15" },
  { id: "6", slug: "dilnoza-baguette", name: "Dilnoza baguette", color: "Pudra", price: "580 000", priceNum: 580000, oldPrice: "690 000", tag: "-10%", colors: [{name:"Pudra",hex:"#C98B93"},{name:"Krem",hex:"#E7DCC9"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"28 × 14 × 6 sm"},{k:"Ichki cho'ntak",v:"1 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Zamonaviy baguette shaklidagi sumka.", stock: 10, category: "Crossbody", createdAt: "2025-03-01" },
  { id: "7", slug: "rayhon-bucket", name: "Rayhon bucket", color: "Qumrang", price: "760 000", priceNum: 760000, oldPrice: "890 000", tag: "Hit", colors: [{name:"Qumrang",hex:"#8A7A5A"},{name:"Qora",hex:"#2B1F17"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"26 × 24 × 14 sm"},{k:"Ichki cho'ntak",v:"2 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Bucket shaklidagi original sumka.", stock: 9, category: "Tote", createdAt: "2025-03-10" },
  { id: "8", slug: "kamila-clutch", name: "Kamila clutch", color: "Qora lak", price: "460 000", priceNum: 460000, oldPrice: "540 000", tag: "-15%", colors: [{name:"Qora lak",hex:"#2B1F17"},{name:"Konyak",hex:"#8A5A34"}], specs: [{k:"Material",v:"Lak charm"},{k:"O'lchami",v:"26 × 14 × 4 sm"},{k:"Ichki cho'ntak",v:"1 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Elegant lak charm clutch. Maxsus tadbirlar uchun.", stock: 14, category: "Clutch", createdAt: "2025-03-20" },
  { id: "9", slug: "zuhra-satchel", name: "Zuhra satchel", color: "Konyak", price: "980 000", priceNum: 980000, oldPrice: "1 140 000", tag: "Yangi", colors: [{name:"Konyak",hex:"#8A5A34"},{name:"Zaytun",hex:"#5C6B4A"}], specs: [{k:"Material",v:"Tabiiy charm"},{k:"O'lchami",v:"32 × 24 × 10 sm"},{k:"Ichki cho'ntak",v:"3 ta"},{k:"Kafolat",v:"2 yil"}], image: "", description: "Klassik satchel sumka. Ish va dam olish uchun qulay.", stock: 7, category: "Tote", createdAt: "2025-04-01" },
];

export const reviews = [
  { initial: "SA", name: "Sevinch A.", text: "Charmi juda sifatli, rasmdagidan ham chiroyli. Yetkazish bir kunda bo’ldi." },
  { initial: "NR", name: "Nilufar R.", text: "Noutbukim bemalol sig’adi, ish uchun ideal. Tutqichi qo’lni qiynamaydi." },
  { initial: "GM", name: "Gulnora M.", text: "Rangi ozgina to’qroq chiqdi, lekin umumiy taassurot juda yaxshi." },
];
