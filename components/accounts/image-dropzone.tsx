"use client";

import { useId, useRef, useState } from "react";
import { Check, UploadCloud } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

type Status = "idle" | "dragging" | "loading" | "success";

export function ImageDropzone({
  name,
  label,
  required,
  onFileChange,
}: {
  name: string;
  label: string;
  required?: boolean;
  onFileChange?: (file: File | null, previewUrl: string | null) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  function applyFile(file: File | null) {
    if (!file) {
      setPreview(null);
      setStatus("idle");
      onFileChange?.(null, null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStatus("loading");
    onFileChange?.(file, url);
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setStatus((s) => (s === "dragging" ? "idle" : s));
    const file = event.dataTransfer.files?.[0];
    if (!file || !inputRef.current) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputRef.current.files = dataTransfer.files;
    applyFile(file);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? " *" : ""}
      </label>
      <motion.label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setStatus("dragging");
        }}
        onDragLeave={() => setStatus((s) => (s === "dragging" ? "idle" : s))}
        onDrop={handleDrop}
        animate={{
          scale: status === "dragging" ? 1.02 : 1,
          borderColor:
            status === "dragging"
              ? "var(--color-zinc-400, #a1a1aa)"
              : "transparent",
        }}
        transition={{ duration: 0.15 }}
        className={cn(
          "relative flex h-28 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed text-zinc-500 hover:border-zinc-400 dark:text-zinc-400",
          preview
            ? "border-solid border-zinc-200 p-0 dark:border-zinc-800"
            : "border-zinc-300 dark:border-zinc-700",
          status === "dragging" && "bg-zinc-50 dark:bg-zinc-800/50"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={label}
            className="h-full w-full object-cover"
            onLoad={() => setStatus("success")}
          />
        ) : (
          <span className="flex flex-col items-center gap-1">
            <UploadCloud className="size-5" />
            <span className="text-xs">Click or drop an image</span>
          </span>
        )}

        <AnimatePresence>
          {status === "success" ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow"
            >
              <Check className="size-3" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        required={required}
        className="hidden"
        onChange={(event) => applyFile(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
