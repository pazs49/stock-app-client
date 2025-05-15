import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar1 } from "lucide-react";

import { useState } from "react";

import { toast } from "sonner";

import DatePicker from "react-datepicker";

export function SignUpForm({ setIsLoginForm, className, onSubmit, ...props }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Enter your details below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-3">
              <div className="grid gap-3">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="John"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              <div className="grid gap-3">
                <Label htmlFor="age">Birthday</Label>
                <div className="flex gap-3">
                  <Input
                    readOnly
                    value={birthday}
                    className="cursor-not-allowed"
                  />
                  <DatePicker
                    id="age"
                    selected={birthday}
                    onChange={(date) =>
                      setBirthday(() => {
                        return date.toLocaleDateString("en-US");
                      })
                    }
                    dateFormat="mm/dd/yyyy"
                    customInput={
                      <Button>
                        <Calendar1 />
                      </Button>
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      firstName &&
                      lastName &&
                      email &&
                      password &&
                      confirmPassword &&
                      birthday
                    ) {
                      if (password === confirmPassword) {
                        onSubmit(email, password, {
                          firstName,
                          lastName,
                          birthday,
                          address,
                        });
                      } else {
                        toast.warning("Passwords do not match.");
                      }
                    } else {
                      toast.warning("Please fill out all fields.");
                    }
                  }}
                  type="submit"
                  className="w-full"
                >
                  Sign Up
                </Button>
                <div className="flex justify-center gap-1 text-sm">
                  <p>Already have an account?</p>

                  <a
                    onClick={() => setIsLoginForm(true)}
                    className="underline underline-offset-4 cursor-pointer"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
