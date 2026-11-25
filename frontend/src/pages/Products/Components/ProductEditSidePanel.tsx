import { useId, useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DropDown from "@/components/ui/DropDown";
import ImageUpload from "@/components/ui/ImageUpload";
import type { Product } from "@/types/product";
import { CATEGORY_OPTIONS } from "../constants";

interface ProductFormValues {
  image: File | null; // send to the FastAPI upload endpoint when saving
  name: string;
  price: string; // kept as text while typing; convert to a number on save
  stock: string; // same — convert to a whole number on save
  sku: string;
  category: string;
  aiDescription: string;
  description: string;
}

const EMPTY_FORM: ProductFormValues = {
  image: null,
  name: "",
  price: "",
  stock: "",
  sku: "",
  category: "",
  aiDescription: "",
  description: "",
};

// Fields the table doesn't have yet (SKU, descriptions) start empty until the API provides them.
function toFormValues(product: Product | null): ProductFormValues {
  if (!product) return EMPTY_FORM;
  return {
    ...EMPTY_FORM,
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    category: product.category,
  };
}

const inputClassName =
  "w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600";

interface FormFieldProps {
  label: string;
  hint?: string;
  className?: string;
  children: (id: string, hintId: string | undefined) => React.ReactNode;
}

// Label + input + optional hint, with the ids wired up for screen readers.
function FormField({ label, hint, className = "", children }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children(id, hintId)}
      {hint && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}

interface ProductEditSidePanelProps {
  // null = creating a new product.
  product: Product | null;
}

function ProductEditSidePanel({ product }: ProductEditSidePanelProps) {
  const initialForm = toFormValues(product);
  const [form, setForm] = useState<ProductFormValues>(initialForm);
  // Bumped on reset so ImageUpload remounts and drops its preview.
  const [resetCount, setResetCount] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function updateField<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: send to the FastAPI endpoint.
    console.log("Save product", { id: product?.id, ...form, price: Number(form.price), stock: Number(form.stock) });
  }

  function handleConfirmDelete() {
    setIsDeleteDialogOpen(false);
    // TODO: call the FastAPI delete endpoint, then remove the product from the table.
    console.log("Delete product", product?.id);
  }

  function handleReset() {
    setForm(initialForm);
    setResetCount((count) => count + 1);
  }

  return (
    <div className="product-edit-section flex flex-col h-full bg-white rounded-lg shadow p-4">
      <h2 className="shrink-0 text-lg font-semibold pb-3 mb-4 border-b border-gray-200">
        {product ? "Edit Product" : "New Product"}
      </h2>

      {/* The two description boxes grow/shrink to fill the leftover height. */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 gap-3">
        <ImageUpload
          key={resetCount}
          label="Product image"
          onChange={(file) => updateField("image", file)}
        />

        <FormField label="Product name">
          {(id) => (
            <input
              id={id}
              type="text"
              required
              value={form.name}
              placeholder="e.g. Wireless Earbuds"
              onChange={(event) => updateField("name", event.target.value)}
              className={inputClassName}
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price">
            {(id) => (
              <input
                id={id}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                value={form.price}
                placeholder="0.00"
                onChange={(event) => updateField("price", event.target.value)}
                className={inputClassName}
              />
            )}
          </FormField>

          <FormField label="Stock">
            {(id) => (
              <input
                id={id}
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                required
                value={form.stock}
                placeholder="0"
                onChange={(event) => updateField("stock", event.target.value)}
                className={inputClassName}
              />
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="SKU">
            {(id) => (
              <input
                id={id}
                type="text"
                value={form.sku}
                placeholder="e.g. WE-001"
                onChange={(event) => updateField("sku", event.target.value)}
                className={inputClassName}
              />
            )}
          </FormField>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <DropDown
              value={form.category}
              options={CATEGORY_OPTIONS}
              placeholder="Select a category"
              onChange={(category) => updateField("category", category)}
            />
          </div>
        </div>

        <FormField
          label="Description for AI"
          className="flex-1 min-h-0"
          hint="What the AI assistant should know when answering customers — features, sizing, care, FAQs."
        >
          {(id, hintId) => (
            <textarea
              id={id}
              rows={2}
              aria-describedby={hintId}
              value={form.aiDescription}
              onChange={(event) => updateField("aiDescription", event.target.value)}
              className={`${inputClassName} flex-1 min-h-12 resize-none`}
            />
          )}
        </FormField>

        <FormField label="Item description" className="flex-1 min-h-0" hint="Shown to customers on the product listing.">
          {(id, hintId) => (
            <textarea
              id={id}
              rows={2}
              aria-describedby={hintId}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className={`${inputClassName} flex-1 min-h-12 resize-none`}
            />
          )}
        </FormField>

        {/* Delete sits apart on the left so it's harder to hit by mistake. */}
        <div className="flex items-center justify-between shrink-0 gap-2 pt-3 border-t border-gray-200">
          {product && (
            <Button type="button" color="danger" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button type="button" color="clear" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">{product ? "Save changes" : "Add product"}</Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete product?"
        message="This will permanently remove the product. This can't be undone."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}

export default ProductEditSidePanel;
