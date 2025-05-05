import {
  fetchAllUsers,
  adminCreateUser,
  adminApproveUser,
} from "@/api/user/user";

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

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Loading from "@/pages/Loading";

const Admin = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex gap-2">
          {/* User create form */}
          <div className="flex flex-col gap-2">
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                console.log(email);
              }}
              type="email"
              placeholder="Email"
            />
            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="password"
            />
          </div>
          <div>
            <Button
              onClick={async () => {
                const response = await adminCreateUser(email, password, () => {
                  setEmail("");
                  setPassword("");
                  queryClient.invalidateQueries(["users"]);
                });

                if (response.ok) {
                  toast.success("User created!");
                } else {
                  // console.log(response);
                  toast.error(response.error.message);
                }
              }}
              className="h-full"
            >
              Create
            </Button>
          </div>
        </div>
      </div>

      {/* User list */}
      <Table>
        <TableCaption>All Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data.data.map((user) => (
            <TableRow key={user.id}>
              {console.log(user)}
              <TableCell className="font-medium">
                {user.attributes.email}
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
              <TableCell className="font-medium">
                {user.attributes["user-info"].balance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;
