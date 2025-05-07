import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import { sellStock } from "@/api/stocks/stocks";
import { buyStock } from "@/api/stocks/stocks";

import { useQueryClient } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Stock = ({ stock }) => {
  const queryClient = useQueryClient();
  const [qty, setQty] = useState(0);
  return (
    <TableRow key={stock.id}>
      <TableCell className="font-medium">{stock.name}</TableCell>
      <TableCell className="font-medium">{stock.price}</TableCell>
      <TableCell className="font-medium">{stock.qty}</TableCell>
      <TableCell className="font-medium">{stock.qty * stock.price}</TableCell>
      <TableCell className="font-medium">
        <Input
          value={qty}
          onChange={(e) => {
            if (e.target.value < 0) {
              setQty("");
              return;
            }
            setQty(e.target.value);
          }}
          type="number"
          placeholder="QTY"
          min={0}
        />
      </TableCell>
      <TableCell className="font-medium">
        <Button
          onClick={async () => {
            if (qty <= 0 || !qty) {
              toast.error("Quantity must be greater than 0");
              return;
            }
            if (qty > stock.qty) {
              toast.error("Quantity must be less than or equal to stock qty");
              return;
            }
            const response = await sellStock(qty, stock.name);
            if (response.ok) {
              toast.success("Stock sold!");
              setQty(0);
              queryClient.invalidateQueries(["user-stocks"]);
            } else {
              toast.error(response.error.message);
            }
          }}
        >
          Sell
        </Button>
      </TableCell>
      <TableCell className="font-medium">
        <Button
          onClick={async () => {
            if (qty <= 0 || !qty) {
              toast.error("Quantity must be greater than 0");
              return;
            }
            const response = await buyStock(qty, stock.name);
            if (response.ok) {
              toast.success("Stock bought!");
              setQty("");
              queryClient.invalidateQueries(["user-stocks"]);
            } else {
              toast.error(response.error.message);
            }
          }}
        >
          Buy
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Stock;
