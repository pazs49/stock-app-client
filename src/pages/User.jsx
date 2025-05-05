import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchStocks } from "@/api/stocks/stocks";

import React, { useState } from "react";

const User = () => {
  const [stock, setStock] = useState("");
  const [stockData, setStockData] = useState({});
  const [stockQty, setStockQty] = useState(0);
  const [hasStock, setHasStock] = useState(false);

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <Button
          onClick={async () => {
            if (stock.length < 1) return;
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

              console.log(response.data);
              console.log(latestDate);
              console.log(latestData);
            } else {
              setHasStock(false);
              setStockData({});
              console.log(response.error);
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
          <Button>Buy</Button>
        </div>
      )}
    </div>
  );
};

export default User;
