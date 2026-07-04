"use client";

import { useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { createSale, type SaleActionState } from "@/actions/sales";
import { CurrencySelect } from "@/components/accounts/currency-select";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuccessCheck } from "@/components/ui/success-check";
import { triggerDownload } from "@/lib/utils";

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6];

function SoldDialogBody({
  accountId,
  characterId,
  onDone,
}: {
  accountId: string;
  characterId: string;
  onDone: () => void;
}) {
  const [changeType, setChangeType] = useState<"instant" | "scheduled">(
    "instant"
  );
  const [state, formAction, pending] = useActionState<
    SaleActionState,
    FormData
  >(createSale, undefined);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (state?.receiptUrl) {
      toast.success("Account marked as sold.");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (!state?.receiptUrl) return;
    const timeout = setTimeout(() => setRevealed(true), 900);
    return () => clearTimeout(timeout);
  }, [state?.receiptUrl]);

  if (state?.receiptUrl) {
    return (
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Receipt</DialogTitle>
            </DialogHeader>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.receiptUrl}
              alt="Sale receipt"
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  triggerDownload(
                    state.receiptUrl!,
                    `receipt-${characterId}.png`
                  )
                }
              >
                Download receipt
              </Button>
              <Button onClick={onDone}>Done</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SuccessCheck />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Mark as sold</DialogTitle>
      </DialogHeader>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="accountId" value={accountId} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="buyerName">Buyer Name</Label>
          <Input id="buyerName" name="buyerName" required />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Change Option</Label>
          <RadioGroup
            name="changeType"
            value={changeType}
            onValueChange={(value) =>
              setChangeType(value as "instant" | "scheduled")
            }
            className="flex gap-5"
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="instant" /> Instant
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="scheduled" /> Scheduled
            </label>
          </RadioGroup>
        </div>

        {changeType === "scheduled" ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scheduledDays">Days until change</Label>
            <Select name="scheduledDays" defaultValue="1">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_OPTIONS.map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    {day} day{day > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="buyerEmail">Buyer Email</Label>
            <Input id="buyerEmail" name="buyerEmail" type="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="buyerNumber">Buyer Number</Label>
            <Input id="buyerNumber" name="buyerNumber" type="tel" required />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guaranteeDays">Guarantee Days</Label>
            <Input
              id="guaranteeDays"
              name="guaranteeDays"
              type="number"
              min="0"
              step="1"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="priceCurrency">Currency</Label>
            <CurrencySelect name="priceCurrency" />
          </div>
        </div>

        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Saving..." : "Confirm sale"}
        </Button>
      </form>
    </>
  );
}

export function SoldDialog({
  accountId,
  characterId,
}: {
  accountId: string;
  characterId: string;
}) {
  const [open, setOpen] = useState(false);
  const [instance, setInstance] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setInstance((n) => n + 1);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Sold
        </Button>
      </DialogTrigger>
      <DialogContent open={open}>
        <SoldDialogBody
          key={instance}
          accountId={accountId}
          characterId={characterId}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
