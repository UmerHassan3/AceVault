"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { generateCredentialsImage } from "@/actions/accounts";
import { EditContactDialog } from "@/components/accounts/edit-contact-dialog";
import { SoldDialog } from "@/components/accounts/sold-dialog";
import { ViewAccountDialog } from "@/components/accounts/view-account-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpandableImage } from "@/components/ui/expandable-image";
import type { Account } from "@/db/schema";
import { formatMoney, triggerDownload } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {value}
      </span>
    </div>
  );
}

export function AccountCard({ account }: { account: Account }) {
  const [pending, startTransition] = useTransition();

  function handleDownload() {
    startTransition(async () => {
      const result = await generateCredentialsImage(account.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.url) {
        await triggerDownload(
          result.url,
          `account-details-${account.characterId}.png`
        );
      }
    });
  }

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle>{account.characterId}</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {account.email}
            </p>
          </div>
          <Badge variant="secondary">
            {formatMoney(account.boughtPrice, account.boughtCurrency)}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <ExpandableImage
              src={account.screenshot1Url}
              alt="Screenshot 1"
              className="size-16 border border-zinc-200 dark:border-white/10"
            />
            <ExpandableImage
              src={account.screenshot2Url}
              alt="Screenshot 2"
              className="size-16 border border-zinc-200 dark:border-white/10"
            />
            {account.backupCodesUrl ? (
              <ExpandableImage
                src={account.backupCodesUrl}
                alt="Backup codes"
                className="size-16 border border-zinc-200 dark:border-white/10"
              />
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg bg-zinc-50 px-4 py-3 sm:grid-cols-3 dark:bg-white/3">
            <Stat label="Bought From" value={account.boughtFrom} />
            <Stat label="Guarantee" value={`${account.guaranteeDays}d`} />
            <Stat label="Number" value={account.number} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              disabled={pending}
            >
              <Download />
              {pending ? "Preparing..." : "Download"}
            </Button>
            <EditContactDialog
              accountId={account.id}
              email={account.email}
              number={account.number}
              guaranteeDays={account.guaranteeDays}
            />
            <SoldDialog
              accountId={account.id}
              characterId={account.characterId}
            />
            <ViewAccountDialog
              accountId={account.id}
              characterId={account.characterId}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
