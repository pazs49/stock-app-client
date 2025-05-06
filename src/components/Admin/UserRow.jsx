import { adminApproveUser } from "@/api/user/user";
import { adminUpdateUserBalance } from "@/api/user/user";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

import { Link } from "react-router-dom";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const UserRow = ({ user }) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balance, setBalance] = useState(user.attributes["user-info"].balance);

  const queryClient = useQueryClient();

  return (
    <TableRow key={user.id}>
      {console.log(user)}
      <TableCell className="font-medium">
        <Link to={`/admin/user/${user.id}`} className="underline">
          {user.attributes.email}
        </Link>
      </TableCell>
      <TableCell className="font-medium">
        <Button
          onClick={async () => {
            if (user.attributes["confirmed-at"]) {
              return;
            }
            const response = await adminApproveUser(user.id);
            if (response.ok) {
              toast.success("User approved!");
              queryClient.invalidateQueries(["users"]);
            } else {
              toast.error(response.error.message);
            }
          }}
          size="sm"
          className={` ${
            user.attributes["confirmed-at"]
              ? "bg-green-600 cursor-not-allowed"
              : "bg-red-600 cursor-pointer"
          }`}
        >
          {user.attributes["confirmed-at"] ? "Confirmed" : "Pending"}
        </Button>
      </TableCell>
      <TableCell
        onClick={() => {
          setIsEditingBalance(true);
        }}
        className="font-medium cursor-pointer"
      >
        {isEditingBalance ? (
          <Input
            className="w-24 h-6 px-0 py-0 border-none bg-transparent text-inherit focus:ring-0 focus:outline-none"
            type="number"
            value={balance}
            onChange={(e) => {
              setBalance(e.target.value);
            }}
            onBlur={() => {
              setIsEditingBalance(false);
              adminUpdateUserBalance(user.id, balance);
            }}
            autoFocus
          />
        ) : (
          balance
        )}
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
