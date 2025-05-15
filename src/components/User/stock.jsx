import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toast } from "sonner";

import { sellStock, buyStock, updateStock } from "@/api/stocks/stocks";

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
          className={"bg-red-500 hover:bg-red-600"}
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
          className="bg-green-500 hover:bg-green-600"
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
      <TableCell className="font-medium">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={async () => {
                  const data = await updateStock(stock.name);
                  queryClient.invalidateQueries(["user-stocks"]);
                  if (data.ok) {
                    toast.success("Stock updated!");
                  }
                }}
              >
                <RefreshCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get Updated {stock.name} Data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};

export default Stock;
