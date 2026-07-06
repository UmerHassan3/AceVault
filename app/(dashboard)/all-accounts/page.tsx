import { PackageOpen } from "lucide-react";
import { desc, ilike } from "drizzle-orm";

import { AllAccountCard } from "@/components/accounts/all-account-card";
import { AllAccountsTable } from "@/components/accounts/all-accounts-table";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StaggerGrid } from "@/components/ui/stagger-grid";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AllAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const rows = await db.query.accounts.findMany({
    where: q ? ilike(accounts.characterId, `%${q}%`) : undefined,
    orderBy: desc(accounts.createdAt),
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="All Accounts"
        description={`${rows.length} account${rows.length === 1 ? "" : "s"} total`}
        actions={<SearchInput />}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title={q ? "No matching accounts" : "No accounts yet"}
          description={
            q
              ? `No accounts found for Character ID "${q}".`
              : "Add your first account to get started."
          }
        />
      ) : (
        <>
          <div className="lg:hidden">
            <StaggerGrid>
              {rows.map((account) => (
                <AllAccountCard key={account.id} account={account} />
              ))}
            </StaggerGrid>
          </div>
          <div className="hidden lg:block">
            <AllAccountsTable accounts={rows} />
          </div>
        </>
      )}
    </div>
  );
}
