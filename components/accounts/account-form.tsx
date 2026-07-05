"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { createAccount, type ActionState } from "@/actions/accounts";
import { CurrencySelect } from "@/components/accounts/currency-select";
import { ImageDropzone } from "@/components/accounts/image-dropzone";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionError } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { NewAccountSchema } from "@/lib/validations/account";
import { assertImageFile, assertOptionalImageFile } from "@/lib/validations/file";

const STEP_LABELS = ["Account Info", "Screenshots", "Confirm"];

type Summary = {
  boughtPrice: string;
  boughtCurrency: string;
  boughtFrom: string;
  guaranteeDays: string;
  characterId: string;
  email: string;
  number: string;
};

export function AccountForm({ onSuccess }: { onSuccess?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string | undefined>();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [previews, setPreviews] = useState<{
    screenshot1?: string | null;
    screenshot2?: string | null;
    backupCodes?: string | null;
  }>({});

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createAccount,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Account added.");
      formRef.current?.reset();
      onSuccess?.();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  function goToScreenshots() {
    const data = new FormData(formRef.current!);
    const parsed = NewAccountSchema.safeParse({
      boughtPrice: data.get("boughtPrice"),
      boughtCurrency: data.get("boughtCurrency"),
      boughtFrom: data.get("boughtFrom"),
      guaranteeDays: data.get("guaranteeDays"),
      characterId: data.get("characterId"),
      email: data.get("email"),
      number: data.get("number"),
      password: data.get("password"),
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      const errors: Record<string, string> = {};
      for (const key of Object.keys(flattened)) {
        const message = flattened[key as keyof typeof flattened]?.[0];
        if (message) errors[key] = message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSummary({
      boughtPrice: String(data.get("boughtPrice") ?? ""),
      boughtCurrency: String(data.get("boughtCurrency") ?? ""),
      boughtFrom: String(data.get("boughtFrom") ?? ""),
      guaranteeDays: String(data.get("guaranteeDays") ?? ""),
      characterId: String(data.get("characterId") ?? ""),
      email: String(data.get("email") ?? ""),
      number: String(data.get("number") ?? ""),
    });
    setStep(1);
  }

  function goToConfirm() {
    const data = new FormData(formRef.current!);
    try {
      assertImageFile(data.get("screenshot1"), "Screenshot 1");
      assertImageFile(data.get("screenshot2"), "Screenshot 2");
      assertOptionalImageFile(data.get("backupCodes"), "Backup codes screenshot");
    } catch (error) {
      if (error instanceof ActionError) {
        setFileError(error.message);
        return;
      }
      throw error;
    }
    setFileError(undefined);
    setStep(2);
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <Stepper step={step} />

      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `${-step * 100}%` }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
        >
          {/* Step 1: Account Info */}
          <div className="w-full shrink-0 pr-1" inert={step !== 0}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="boughtPrice">Bought Price</Label>
                  <Input
                    id="boughtPrice"
                    name="boughtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className={cn(fieldErrors.boughtPrice && "border-red-500")}
                  />
                  <FieldError message={fieldErrors.boughtPrice} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="boughtCurrency">Currency</Label>
                  <CurrencySelect name="boughtCurrency" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="boughtFrom">Bought From</Label>
                  <Input
                    id="boughtFrom"
                    name="boughtFrom"
                    className={cn(fieldErrors.boughtFrom && "border-red-500")}
                  />
                  <FieldError message={fieldErrors.boughtFrom} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="guaranteeDays">Guarantee Days</Label>
                  <Input
                    id="guaranteeDays"
                    name="guaranteeDays"
                    type="number"
                    step="1"
                    min="0"
                    className={cn(fieldErrors.guaranteeDays && "border-red-500")}
                  />
                  <FieldError message={fieldErrors.guaranteeDays} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="characterId">Character ID</Label>
                <Input
                  id="characterId"
                  name="characterId"
                  className={cn(fieldErrors.characterId && "border-red-500")}
                />
                <FieldError message={fieldErrors.characterId} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className={cn(fieldErrors.email && "border-red-500")}
                  />
                  <FieldError message={fieldErrors.email} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="number">Number</Label>
                  <Input
                    id="number"
                    name="number"
                    type="tel"
                    className={cn(fieldErrors.number && "border-red-500")}
                  />
                  <FieldError message={fieldErrors.number} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">In-Game Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className={cn(fieldErrors.password && "border-red-500")}
                />
                <FieldError message={fieldErrors.password} />
              </div>

              <Button type="button" onClick={goToScreenshots} className="mt-2">
                Next: Screenshots
              </Button>
            </div>
          </div>

          {/* Step 2: Screenshots */}
          <div className="w-full shrink-0 px-1" inert={step !== 1}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <ImageDropzone
                  name="screenshot1"
                  label="Screenshot 1"
                  required
                  onFileChange={(_file, url) =>
                    setPreviews((p) => ({ ...p, screenshot1: url }))
                  }
                />
                <ImageDropzone
                  name="screenshot2"
                  label="Screenshot 2"
                  required
                  onFileChange={(_file, url) =>
                    setPreviews((p) => ({ ...p, screenshot2: url }))
                  }
                />
              </div>
              <ImageDropzone
                name="backupCodes"
                label="Backup Codes Screenshot"
                onFileChange={(_file, url) =>
                  setPreviews((p) => ({ ...p, backupCodes: url }))
                }
              />
              <FieldError message={fileError} />

              <div className="mt-2 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="button" onClick={goToConfirm} className="flex-1">
                  Next: Confirm
                </Button>
              </div>
            </div>
          </div>

          {/* Step 3: Confirm */}
          <div className="w-full shrink-0 pl-1" inert={step !== 2}>
            <div className="flex flex-col gap-4">
              {summary ? (
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-md border border-zinc-200 p-4 text-sm sm:grid-cols-2 dark:border-zinc-800">
                  <dt className="text-zinc-500 dark:text-zinc-400">Character ID</dt>
                  <dd>{summary.characterId}</dd>
                  <dt className="text-zinc-500 dark:text-zinc-400">Bought Price</dt>
                  <dd>
                    {summary.boughtPrice} {summary.boughtCurrency}
                  </dd>
                  <dt className="text-zinc-500 dark:text-zinc-400">Bought From</dt>
                  <dd>{summary.boughtFrom}</dd>
                  <dt className="text-zinc-500 dark:text-zinc-400">Guarantee</dt>
                  <dd>{summary.guaranteeDays} days</dd>
                  <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
                  <dd className="truncate">{summary.email}</dd>
                  <dt className="text-zinc-500 dark:text-zinc-400">Number</dt>
                  <dd>{summary.number}</dd>
                </dl>
              ) : null}

              <div className="flex gap-2">
                {previews.screenshot1 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previews.screenshot1}
                    alt="Screenshot 1"
                    className="size-16 rounded-md border border-zinc-200 object-cover dark:border-zinc-800"
                  />
                ) : null}
                {previews.screenshot2 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previews.screenshot2}
                    alt="Screenshot 2"
                    className="size-16 rounded-md border border-zinc-200 object-cover dark:border-zinc-800"
                  />
                ) : null}
                {previews.backupCodes ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previews.backupCodes}
                    alt="Backup codes"
                    className="size-16 rounded-md border border-zinc-200 object-cover dark:border-zinc-800"
                  />
                ) : null}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={pending || step !== 2} className="flex-1">
                  {pending ? "Saving..." : "Save account"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </form>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEP_LABELS.map((label, index) => (
        <div key={label} className="flex flex-1 items-center gap-2 last:flex-none">
          <div
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
              index <= step
                ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            )}
          >
            {index + 1}
          </div>
          <span
            className={cn(
              "hidden text-xs font-medium sm:inline",
              index === step
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 dark:text-zinc-500"
            )}
          >
            {label}
          </span>
          {index < STEP_LABELS.length - 1 ? (
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
