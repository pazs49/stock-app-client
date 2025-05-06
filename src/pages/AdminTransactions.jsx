import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserTransactions } from "@/api/user/transactions";
import Loading from "@/pages/Loading";

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

const AdminTransactions = () => {
  const { data: userTransactions, isLoading } = useQuery({
    queryKey: ["user-transactions"],
    queryFn: () => fetchUserTransactions("admin"),
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div>
        <Table>
          <TableCaption>Transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User's Email</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(userTransactions?.data?.data) ? (
              userTransactions.data.data.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={`${
                    transaction.attributes.action === "buy"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <TableCell className="font-medium">
                    {transaction.attributes.email}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.attributes.action}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.attributes.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.attributes.qty}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.attributes.price}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.attributes.date}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No transactions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTransactions;
