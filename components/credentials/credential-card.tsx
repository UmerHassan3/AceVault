"use client";

import { motion } from "motion/react";

import { EditContactDialog } from "@/components/accounts/edit-contact-dialog";
import { CountdownBadge } from "@/components/credentials/countdown-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Account, Sale } from "@/db/schema";

export function CredentialCard({
  sale,
}: {
  sale: Sale & { account: Account };
}) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle>{sale.account.characterId}</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {sale.account.email}
            </p>
          </div>
          <CountdownBadge
            changeType={sale.changeType}
            changeDeadlineAt={
              sale.changeDeadlineAt
                ? new Date(sale.changeDeadlineAt).toISOString()
                : null
            }
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Buyer
              </span>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {sale.buyerName}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Number
              </span>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {sale.account.number}
              </span>
            </div>
          </div>
          <EditContactDialog
            accountId={sale.account.id}
            email={sale.account.email}
            number={sale.account.number}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
