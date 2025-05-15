import Admin from "@/pages/Admin";
import User from "@/pages/User";

import { fetchUserInfo } from "@/api/user/user";
import { logout } from "@/api/auth/auth";

import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Loading from "@/pages/Loading";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CircleDollarSign } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["user-info"],
    queryFn: () => fetchUserInfo(),
  });

  const isAdmin = () => {
    if (userInfo?.data) {
      // console.log("user", userInfo);
      return userInfo?.data?.attributes.admin;
    }
    return false;
  };

  if (isLoading) {
    return <Loading />;
  }

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
        <p className="flex items-center gap-2 text-md font-semibold">
          {isAdmin() ? (
            "Admin"
          ) : (
            <>
              <CircleDollarSign />
              {`${userInfo?.data.attributes.balance}`}
              <CircleDollarSign />
            </>
          )}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar onClick={() => navigate("/user-info")}>
                <AvatarImage src="#" />
                <AvatarFallback className={"cursor-pointer"}>
                  {userInfo?.data?.attributes["first-name"][0].toUpperCase() +
                    userInfo?.data?.attributes["last-name"][0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{userInfo?.meta.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      <div className="mt-3">{isAdmin() ? <Admin /> : <User />}</div>
    </div>
  );
};

export default Dashboard;
