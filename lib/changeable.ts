type ChangeableSale = {
  changeType: "instant" | "scheduled";
  changeDeadlineAt: Date | string | null;
};

export function isSaleChangeable(sale: ChangeableSale, now: Date = new Date()): boolean {
  if (sale.changeType === "instant") return true;
  if (!sale.changeDeadlineAt) return true;
  return now.getTime() >= new Date(sale.changeDeadlineAt).getTime();
}

// Takes a snapshot timestamp as a plain helper (not a component/hook), so
// calling Date.now() for the default lives outside any component's render body.
export function withChangeableComputed<T extends ChangeableSale>(
  rows: T[],
  now: number = Date.now()
) {
  return rows.map((sale) => ({
    sale,
    changeable: isSaleChangeable(sale, new Date(now)),
    remainingMs: sale.changeDeadlineAt
      ? new Date(sale.changeDeadlineAt).getTime() - now
      : 0,
  }));
}
