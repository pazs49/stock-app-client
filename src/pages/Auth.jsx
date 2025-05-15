import { LoginForm } from "@/components/login-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";

import { checkToken } from "@/api/auth/auth";
import { login, signup } from "@/api/auth/auth";

import { toast } from "sonner";

import { SignUpForm } from "@/components/SignUpForm";

import { useState } from "react";

import Loading from "@/pages/Loading";

export default function Page() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { data: isLoggedIn, isLoading } = useQuery({
    queryKey: ["checkToken"],
    queryFn: checkToken,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (isLoggedIn) {
    console.log("logged");
    return <Navigate to="/" />;
  } else {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {isLoginForm ? (
            <LoginForm
              setIsLoginForm={setIsLoginForm}
              onSubmit={async (email, password) => {
                const response = await login(email, password);
                if (response.ok) {
                  await queryClient.invalidateQueries({
                    queryKey: ["checkToken"],
                  });
                  navigate("/");
                  toast.success("Login successful!");
                } else {
                  toast.error(response.error.message);
                }
              }}
            />
          ) : (
            <SignUpForm
              setIsLoginForm={setIsLoginForm}
              onSubmit={async (email, password, personalInfo) => {
                const response = await signup(email, password, personalInfo);
                if (response.ok) {
                  setIsLoginForm(true);
                  toast.success("Sign up successful!");
                } else {
                  toast.error(response.error.message);
                }
              }}
            />
          )}
        </div>
      </div>
    );
  }
}
