import { PackageOpen } from "lucide-react";
import { and, desc, eq, ilike } from "drizzle-orm";

import { AccountCard } from "@/components/accounts/account-card";
import { NewAccountDialog } from "@/components/accounts/new-account-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StaggerGrid } from "@/components/ui/stagger-grid";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function NewAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const rows = await db.query.accounts.findMany({
    where: and(
      eq(accounts.status, "available"),
      q ? ilike(accounts.characterId, `%${q}%`) : undefined
    ),
    orderBy: desc(accounts.createdAt),
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Accounts"
        description={`${rows.length} account${rows.length === 1 ? "" : "s"} available`}
        actions={
          <>
            <SearchInput />
            <NewAccountDialog />
          </>
        }
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
        <StaggerGrid>
          {rows.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </StaggerGrid>
      )}
    </div>
  );
}
