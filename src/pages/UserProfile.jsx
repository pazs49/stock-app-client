import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserByAdmin } from "@/api/user/user";
import Loading from "./Loading";

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

const UserProfile = () => {
  const { id } = useParams();
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserByAdmin(id),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center">
      <div>
        <Table>
          <TableCaption>All Users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">User's Email</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(userData?.meta?.transactions) &&
            userData.meta.transactions.length > 0 ? (
              userData.meta.transactions.map((transaction) => (
                <TableRow
                  className={`${
                    transaction.action === "buy" ? "bg-green-100" : "bg-red-100"
                  }`}
                  key={transaction.id}
                >
                  <TableCell className="font-medium">
                    {userData.meta.email}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.action}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.qty}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.price}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.date}
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

export default UserProfile;
