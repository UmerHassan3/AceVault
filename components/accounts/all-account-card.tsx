"use client";

import { motion } from "motion/react";

import { ViewAccountDialog } from "@/components/accounts/view-account-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import type { Account } from "@/db/schema";
import { formatMoney } from "@/lib/utils";

export function AllAccountCard({ account }: { account: Account }) {
  const sold = account.status === "sold";

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
          <Badge variant={sold ? "secondary" : "success"} dot>
            {sold ? "Sold" : "Available"}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-zinc-50 px-4 py-3 sm:grid-cols-3 dark:bg-white/3">
            <Stat label="Bought From" value={account.boughtFrom} />
            <Stat label="Guarantee" value={`${account.guaranteeDays}d`} />
            <Stat label="Number" value={account.number} />
          </div>

          <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Price
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
              {formatMoney(account.boughtPrice, account.boughtCurrency)}
            </span>
          </div>

          <ViewAccountDialog
            accountId={account.id}
            characterId={account.characterId}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
