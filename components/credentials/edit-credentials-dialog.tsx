"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { updateSoldAccountCredentials } from "@/actions/accounts";
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
import { UpdateSoldAccountSchema } from "@/lib/validations/account";

export function EditCredentialsDialog({
  accountId,
  email,
  number,
}: {
  accountId: string;
  email: string;
  number: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = UpdateSoldAccountSchema.safeParse({
      accountId: formData.get("accountId"),
      email: formData.get("email"),
      number: formData.get("number"),
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
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
      const result = await updateSoldAccountCredentials(undefined, formData);
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
              placeholder="buyer@example.com"
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

          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-200 p-3 dark:border-white/10">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Leave all three password fields blank to keep the current password.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`oldPassword-${accountId}`}>Old Password</Label>
              <Input
                id={`oldPassword-${accountId}`}
                name="oldPassword"
                type="password"
                placeholder="Current in-game password"
                className={cn(fieldErrors.oldPassword && "border-red-500")}
              />
              <FieldError message={fieldErrors.oldPassword} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`newPassword-${accountId}`}>New Password</Label>
              <Input
                id={`newPassword-${accountId}`}
                name="newPassword"
                type="password"
                placeholder="New in-game password"
                className={cn(fieldErrors.newPassword && "border-red-500")}
              />
              <FieldError message={fieldErrors.newPassword} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`confirmPassword-${accountId}`}>
                Confirm Password
              </Label>
              <Input
                id={`confirmPassword-${accountId}`}
                name="confirmPassword"
                type="password"
                placeholder="Retype the new password"
                className={cn(fieldErrors.confirmPassword && "border-red-500")}
              />
              <FieldError message={fieldErrors.confirmPassword} />
            </div>
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
