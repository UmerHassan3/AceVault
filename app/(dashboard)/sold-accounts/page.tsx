import { Receipt } from "lucide-react";
import { desc } from "drizzle-orm";

import { PageHeader } from "@/components/layout/page-header";
import { ReceiptCard } from "@/components/sales/receipt-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StaggerGrid } from "@/components/ui/stagger-grid";
import { db } from "@/db";
import { sales } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function SoldAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const allRows = await db.query.sales.findMany({
    orderBy: desc(sales.soldAt),
    with: { account: true },
  });

  const rows = q
    ? allRows.filter((row) =>
        row.account.characterId.toLowerCase().includes(q.toLowerCase())
      )
    : allRows;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sold Accounts"
        description={`${rows.length} of ${allRows.length} sale${allRows.length === 1 ? "" : "s"} recorded`}
        actions={<SearchInput />}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={q ? "No matching sales" : "No sales yet"}
          description={
            q
              ? `No sales found for Character ID "${q}".`
              : "Mark an account as sold from New Accounts."
          }
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
