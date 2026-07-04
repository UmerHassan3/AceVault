"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CurrencySelect({
  name,
  defaultValue = "USDT",
}: {
  name: string;
  defaultValue?: "USDT" | "PKR";
}) {
  return (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USDT">USDT</SelectItem>
        <SelectItem value="PKR">PKR</SelectItem>
      </SelectContent>
    </Select>
  );
}
