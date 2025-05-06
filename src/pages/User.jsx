import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Stock from "@/components/User/stock";

import { fetchStocks } from "@/api/stocks/stocks";
import { fetchUserStocks } from "@/api/stocks/stocks";
import { buyStock } from "@/api/stocks/stocks";
import { sellStock } from "@/api/stocks/stocks";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";

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

import Loading from "@/pages/Loading";

const User = () => {
  const queryClient = useQueryClient();
  const [stock, setStock] = useState("");
  const [stockData, setStockData] = useState({});
  const [stockQty, setStockQty] = useState(0);
  const [hasStock, setHasStock] = useState(false);

  const navigate = useNavigate();

  const { data: userStocks, isLoading } = useQuery({
    queryKey: ["user-stocks"],
    queryFn: fetchUserStocks,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value.toUpperCase())}
        />
        <Button
          onClick={async () => {
            if (stock.length < 1) {
              toast.error("Stock symbol is required");
              return;
            }
            const response = await fetchStocks(stock);
            if (response.ok) {
              setHasStock(true);

              const timeSeries = response.data["Time Series (Daily)"];
              const dates = Object.keys(timeSeries);
              const latestDate = dates[0];
              const latestData = timeSeries[latestDate];

              setStockData({
                name: response.data["Meta Data"]["2. Symbol"],
                price: latestData["4. close"],
                volume: latestData["5. volume"],
              });
            } else {
              setHasStock(false);
              setStockData({});
            }
          }}
        >
          Submit
        </Button>
      </div>
      {hasStock && (
        <div className="flex flex-col gap-2 bg-green-100 p-4 rounded animate-slide-down origin-top">
          <p>Name: {stockData.name}</p>
          <p>Price: {stockData.price}</p>
          <p>Volume: {stockData.volume}</p>
          <Input
            placeholder="QTY"
            type="number"
            value={stockQty}
            onChange={(e) => {
              if (e.target.value < 0) {
                setStockQty(0);
                return;
              }
              setStockQty(e.target.value);
            }}
          />
          <Button
            onClick={async () => {
              const response = await buyStock(stockQty, stock);
              if (response.ok) {
                toast.success("Stock bought!");
                queryClient.invalidateQueries(["user-stocks"]);
              } else {
                toast.error(response.error.message);
              }
            }}
          >
            Buy
          </Button>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Button onClick={() => navigate("/user-transactions")}>
          Transactions History
        </Button>
      </div>

      {/* Stocks list */}
      <Table>
        <TableCaption>Stocks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(userStocks?.data) ? (
            userStocks.data.map(
              (stock) => stock.qty > 0 && <Stock key={stock.id} stock={stock} />
            )
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No stocks
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default User;
