import { KeyRound } from "lucide-react";
import { desc } from "drizzle-orm";

import { CredentialCard } from "@/components/credentials/credential-card";
import { FilterSortBar } from "@/components/credentials/filter-sort-bar";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StaggerGrid } from "@/components/ui/stagger-grid";
import { db } from "@/db";
import { sales } from "@/db/schema";
import { withChangeableComputed } from "@/lib/changeable";

export const dynamic = "force-dynamic";

export default async function CredentialsToChangePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>;
}) {
  const { status = "all", sort = "days" } = await searchParams;

  const rows = await db.query.sales.findMany({
    orderBy: desc(sales.soldAt),
    with: { account: true },
  });

  const withComputed = withChangeableComputed(rows);

  const filtered = withComputed.filter((row) => {
    if (status === "pending") return !row.changeable;
    if (status === "changeable") return row.changeable;
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "newest") {
      return (
        new Date(b.sale.soldAt).getTime() - new Date(a.sale.soldAt).getTime()
      );
    }
    if (a.changeable !== b.changeable) return a.changeable ? 1 : -1;
    return a.remainingMs - b.remainingMs;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Credentials to Change"
        description={`${filtered.length} of ${rows.length} sold account${rows.length === 1 ? "" : "s"}`}
        actions={<FilterSortBar />}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title="Nothing to show here"
          description="Try a different filter, or check back once an account sells."
        />
      ) : (
        <StaggerGrid>
          {filtered.map(({ sale }) => (
            <CredentialCard key={sale.id} sale={sale} />
          ))}
        </StaggerGrid>
      )}
    </div>
  );
}
