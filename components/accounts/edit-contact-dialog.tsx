"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { updateAccountContact } from "@/actions/accounts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UpdateContactSchema } from "@/lib/validations/account";

export function EditContactDialog({
  accountId,
  email,
  number,
  guaranteeDays,
}: {
  accountId: string;
  email: string;
  number: string;
  guaranteeDays: number;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = UpdateContactSchema.safeParse({
      accountId: formData.get("accountId"),
      email: formData.get("email"),
      number: formData.get("number"),
      guaranteeDays: formData.get("guaranteeDays"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      const result = await updateAccountContact(undefined, formData);
      if (result?.success) {
        toast.success("Account updated.");
        setOpen(false);
      } else if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent open={open}>
        <DialogHeader>
          <DialogTitle>Update account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="accountId" value={accountId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`email-${accountId}`}>Email</Label>
            <Input
              id={`email-${accountId}`}
              name="email"
              type="email"
              placeholder="account@example.com"
              defaultValue={email}
              className={cn(fieldErrors.email && "border-red-500")}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`number-${accountId}`}>Number</Label>
            <Input
              id={`number-${accountId}`}
              name="number"
              type="tel"
              placeholder="+92 300 1234567"
              defaultValue={number}
              className={cn(fieldErrors.number && "border-red-500")}
            />
            <FieldError message={fieldErrors.number} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`guaranteeDays-${accountId}`}>Guarantee Days</Label>
            <Input
              id={`guaranteeDays-${accountId}`}
              name="guaranteeDays"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 7"
              defaultValue={guaranteeDays}
              className={cn(fieldErrors.guaranteeDays && "border-red-500")}
            />
            <FieldError message={fieldErrors.guaranteeDays} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`password-${accountId}`}>
              New Password (optional)
            </Label>
            <Input
              id={`password-${accountId}`}
              name="password"
              type="password"
              placeholder="Leave blank to keep current"
              className={cn(fieldErrors.password && "border-red-500")}
            />
            <FieldError message={fieldErrors.password} />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
