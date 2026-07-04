import { ActionError } from "@/lib/errors";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

function checkConstraints(file: File, label: string) {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ActionError(`${label} must be smaller than 5MB.`);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ActionError(`${label} must be a PNG, JPEG, or WEBP image.`);
  }
}

export function assertImageFile(value: FormDataEntryValue | null, label: string): File {
  if (!(value instanceof File) || value.size === 0) {
    throw new ActionError(`${label} is required.`);
  }
  checkConstraints(value, label);
  return value;
}

export function assertOptionalImageFile(
  value: FormDataEntryValue | null,
  label: string
): File | null {
  if (!(value instanceof File) || value.size === 0) return null;
  checkConstraints(value, label);
  return value;
}
