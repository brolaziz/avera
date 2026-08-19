"use client";

import { useAdmin } from "@/lib/admin-store";
import { ProductForm, emptyProductForm } from "@/components/ProductForm";

export default function AddProductPage() {
  const { addProduct } = useAdmin();

  return (
    <ProductForm
      title="Yangi mahsulot"
      initial={emptyProductForm()}
      onSubmit={addProduct}
      submitLabel="Qo'shish"
    />
  );
}
