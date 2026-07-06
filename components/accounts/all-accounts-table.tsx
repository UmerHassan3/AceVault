import { ViewAccountDialog } from "@/components/accounts/view-account-dialog";
import { Badge } from "@/components/ui/badge";
import type { Account } from "@/db/schema";
import { formatMoney } from "@/lib/utils";

export function AllAccountsTable({ accounts }: { accounts: Account[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10">
      <table className="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-[14%]" />
          <col className="w-[20%]" />
          <col className="w-[12%]" />
          <col className="w-[13%]" />
          <col className="w-[9%]" />
          <col className="w-[12%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:border-white/10 dark:bg-white/3 dark:text-zinc-500">
            <th className="px-5 py-3 text-left font-medium">Character ID</th>
            <th className="px-5 py-3 text-left font-medium">Email</th>
            <th className="px-5 py-3 text-left font-medium">Number</th>
            <th className="px-5 py-3 text-left font-medium">Bought From</th>
            <th className="px-5 py-3 text-left font-medium">Guarantee</th>
            <th className="px-5 py-3 text-left font-medium">Price</th>
            <th className="px-5 py-3 text-left font-medium">Status</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const sold = account.status === "sold";
            return (
              <tr
                key={account.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/3"
              >
                <td className="truncate px-5 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                  {account.characterId}
                </td>
                <td className="truncate px-5 py-3 text-zinc-600 dark:text-zinc-400">
                  {account.email}
                </td>
                <td className="truncate px-5 py-3 text-zinc-600 dark:text-zinc-400">
                  {account.number}
                </td>
                <td className="truncate px-5 py-3 text-zinc-600 dark:text-zinc-400">
                  {account.boughtFrom}
                </td>
                <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                  {account.guaranteeDays}d
                </td>
                <td className="truncate px-5 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                  {formatMoney(account.boughtPrice, account.boughtCurrency)}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={sold ? "secondary" : "success"} dot className="w-fit">
                    {sold ? "Sold" : "Available"}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <ViewAccountDialog
                    accountId={account.id}
                    characterId={account.characterId}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
