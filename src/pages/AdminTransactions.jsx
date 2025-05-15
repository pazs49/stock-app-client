import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserTransactions } from "@/api/user/transactions";
import Loading from "@/pages/Loading";
import PaginationNav from "@/components/PaginationNav";
import usePaginationData from "@/hooks/usePaginationData";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const transactionsArray = Array.isArray(userTransactions?.data?.data)
    ? userTransactions.data.data
    : [];

  const filteredTransactions = transactionsArray.filter((transaction) => {
    const email = transaction.attributes.email.toLowerCase();
    const symbol = transaction.attributes.name.toLowerCase();
    return (
      email.includes(search.toLowerCase()) ||
      symbol.includes(search.toLowerCase())
    );
  });

  const { currentItems, pageCount, handlePageClick } = usePaginationData(
    filteredTransactions,
    10,
    currentPage,
    setCurrentPage
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
        <h1 className="text-lg font-bold text-center">Transactions</h1>
        <input
          type="text"
          placeholder="Search by user email or symbol"
          className="px-4 py-2 border rounded-md w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(0);
          }}
        />
        <Table>
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
            {currentItems.length > 0 ? (
              currentItems.map((transaction) => (
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

        <PaginationNav
          handlePageClick={handlePageClick}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
};

export default AdminTransactions;
