import { Receipt } from "lucide-react";
import { desc } from "drizzle-orm";

import { PageHeader } from "@/components/layout/page-header";
import { ReceiptCard } from "@/components/sales/receipt-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StaggerGrid } from "@/components/ui/stagger-grid";
import { db } from "@/db";
import { sales } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function SoldAccountsPage() {
  const rows = await db.query.sales.findMany({
    orderBy: desc(sales.soldAt),
    with: { account: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sold Accounts"
        description={`${rows.length} sale${rows.length === 1 ? "" : "s"} recorded`}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No sales yet"
          description="Mark an account as sold from New Accounts."
        />
      ) : (
        <StaggerGrid>
          {rows.map((sale) => (
            <ReceiptCard key={sale.id} sale={sale} />
          ))}
        </StaggerGrid>
      )}
    </div>
  );
}
