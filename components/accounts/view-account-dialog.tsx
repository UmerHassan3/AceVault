"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getAccountDetails, type AccountDetails } from "@/actions/accounts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpandableImage } from "@/components/ui/expandable-image";
import { formatMoney } from "@/lib/utils";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-zinc-100 py-2.5 last:border-0 dark:border-white/5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
      <span className="break-all text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {value}
      </span>
    </div>
  );
}

export function ViewAccountDialog({
  accountId,
  characterId,
}: {
  accountId: string;
  characterId: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<AccountDetails | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next && !details) {
      setLoading(true);
      getAccountDetails(accountId)
        .then((result) => {
          if (result.error) {
            toast.error(result.error);
            setOpen(false);
            return;
          }
          if (result.data) setDetails(result.data);
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          View
        </Button>
      </DialogTrigger>
      <DialogContent open={open}>
        <DialogHeader>
          <DialogTitle>{characterId}</DialogTitle>
        </DialogHeader>

        {loading || !details ? (
          <div className="flex items-center justify-center py-10 text-zinc-400">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col rounded-lg border border-zinc-200 px-4 dark:border-white/10">
              <DetailRow label="Bought From" value={details.boughtFrom} />
              <DetailRow
                label="Bought Price"
                value={formatMoney(details.boughtPrice, details.boughtCurrency)}
              />
              <DetailRow label="Guarantee Days" value={`${details.guaranteeDays} days`} />
              <DetailRow label="Email" value={details.email} />
              <DetailRow label="Number" value={details.number} />
              <DetailRow
                label="In-Game Password"
                value={
                  <span className="flex items-center gap-2">
                    <span className="font-mono">
                      {showPassword ? details.password : "•".repeat(10)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </span>
                }
              />
            </div>

            {details.description ? (
              <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 p-3 dark:border-white/10">
                <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Description
                </span>
                <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {details.description}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <ExpandableImage
                src={details.screenshot1Url}
                alt="Screenshot 1"
                width={110}
                height={110}
                className="size-28 border border-zinc-200 dark:border-white/10"
              />
              <ExpandableImage
                src={details.screenshot2Url}
                alt="Screenshot 2"
                width={110}
                height={110}
                className="size-28 border border-zinc-200 dark:border-white/10"
              />
              {details.backupCodesUrl ? (
                <ExpandableImage
                  src={details.backupCodesUrl}
                  alt="Backup codes"
                  width={110}
                  height={110}
                  className="size-28 border border-zinc-200 dark:border-white/10"
                />
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
