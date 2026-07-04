"use client";

import { Download } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpandableImage } from "@/components/ui/expandable-image";
import type { Account, Sale } from "@/db/schema";
import { formatMoney, triggerDownload } from "@/lib/utils";

export function ReceiptCard({ sale }: { sale: Sale & { account: Account } }) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle>{sale.account.characterId}</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Sold to <span className="text-zinc-700 dark:text-zinc-300">{sale.buyerName}</span>
            </p>
          </div>
          <Badge
            dot
            variant={sale.changeType === "instant" ? "success" : "warning"}
          >
            {sale.changeType === "instant"
              ? "Instant"
              : `Scheduled (${sale.scheduledDays}d)`}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Sale price
            </span>
            <span className="text-lg font-semibold tracking-tight">
              {formatMoney(sale.price, sale.priceCurrency)}
            </span>
          </div>

          {sale.receiptUrl ? (
            <ExpandableImage
              src={sale.receiptUrl}
              alt="Receipt"
              width={400}
              height={280}
              className="aspect-400/280 w-full rounded-md border border-zinc-200 dark:border-white/10"
            />
          ) : null}

          {sale.receiptUrl ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                triggerDownload(
                  sale.receiptUrl!,
                  `receipt-${sale.account.characterId}.png`
                )
              }
            >
              <Download />
              Download receipt
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
