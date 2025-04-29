import Admin from "@/pages/Admin";
import User from "@/pages/User";

import { fetchUserInfo } from "@/api/user/user";
import { logout } from "@/api/auth/auth";

import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery({
    queryKey: ["user-info"],
    queryFn: () => fetchUserInfo(),
  });

  const isAdmin = () => {
    if (userInfo?.data) {
      return userInfo.data.attributes.admin;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center mt-3 mx-3">
      <header className="flex w-full justify-between">
        <Button
          className="justify-self-end"
          onClick={() => {
            logout();
            localStorage.removeItem("token");
            queryClient.clear();
            navigate("/login");
          }}
        >
          Logout
        </Button>
        <p>{`BALANCE: ${userInfo?.data.attributes.balance}`}</p>
        {console.log("aaa", userInfo)}
        <p>{`EMAIL: ${userInfo?.meta.email}`}</p>
      </header>
      <div>{isAdmin() ? <Admin /> : <User />}</div>
    </div>
  );
};

export default Dashboard;
