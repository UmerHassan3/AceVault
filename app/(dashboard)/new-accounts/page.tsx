import { PackageOpen } from "lucide-react";
import { desc, eq } from "drizzle-orm";

import { AccountCard } from "@/components/accounts/account-card";
import { NewAccountDialog } from "@/components/accounts/new-account-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StaggerGrid } from "@/components/ui/stagger-grid";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function NewAccountsPage() {
  const rows = await db.query.accounts.findMany({
    where: eq(accounts.status, "available"),
    orderBy: desc(accounts.createdAt),
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Accounts"
        description={`${rows.length} account${rows.length === 1 ? "" : "s"} available`}
        actions={<NewAccountDialog />}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No accounts yet"
          description="Add your first account to get started."
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
