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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditContactDialog({
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateAccountContact(undefined, formData);
      if (result?.success) {
        toast.success("Contact info updated.");
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
          <DialogTitle>Update email / number</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="accountId" value={accountId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`email-${accountId}`}>Email</Label>
            <Input
              id={`email-${accountId}`}
              name="email"
              type="email"
              defaultValue={email}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`number-${accountId}`}>Number</Label>
            <Input
              id={`number-${accountId}`}
              name="number"
              type="tel"
              defaultValue={number}
              required
            />
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
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
