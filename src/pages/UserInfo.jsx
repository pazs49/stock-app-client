import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserInfo, userDeposit } from "@/api/user/user";
import Loading from "./Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, HomeIcon, WalletIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { userUpdateProfile } from "@/api/user/user";

const UserInfo = () => {
  const queryClient = useQueryClient();
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["user-info"],
    queryFn: () => fetchUserInfo(),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const user = userInfo?.data?.attributes || {};
  const meta = userInfo?.data?.meta || {};

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  // Deposit modal state
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [depositMethod, setDepositMethod] = useState("Bank");
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (userInfo) {
      const user = userInfo.data.attributes || {};
      setFirstName(user["first-name"] || "");
      setLastName(user["last-name"] || "");
      setBirthdate(user.birthdate || "");
      setAddress(user.address || "");
      setBalance(user.balance || 0);
    }
  }, [userInfo]);

  const initials = `${firstName[0] || ""}${lastName[0] || ""}`;

  if (isLoading) return <Loading />;

  const handleDeposit = async () => {
    const amountNum = Number(depositAmount);
    if (!depositAmount || isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }
    const response = await userDeposit(amountNum);
    if (response.ok) {
      queryClient.invalidateQueries(["user-info"]);
      toast.success(
        `Deposited $${amountNum.toFixed(2)} via ${depositMethod} successfully!`
      );
    } else {
      toast.error(response.error);
    }

    setDepositOpen(false);
    setDepositAmount("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={userInfo?.profileImage || "/placeholder.svg"}
                alt={`${firstName} ${lastName}`}
              />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl flex gap-2">
                <input
                  className="text-2xl font-semibold bg-transparent border-b focus:outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className="text-2xl font-semibold bg-transparent border-b focus:outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {meta.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Birthdate</p>
                      <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="text-sm text-muted-foreground bg-transparent border-b focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="text-sm text-muted-foreground bg-transparent border-b focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <WalletIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Balance</p>
                      <div className="flex gap-3">
                        <p className="text-sm font-semibold">
                          $
                          {Number(balance).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <Button onClick={() => setDepositOpen(true)}>
                          Deposit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-primary/5 border-none">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Account Status</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button
        onClick={async () => {
          if (
            firstName === user["first-name"] &&
            lastName === user["last-name"] &&
            birthdate === user.birthdate &&
            address === user.address
          ) {
            toast.error("No changes detected!");
            return;
          }

          const response = await userUpdateProfile({
            first_name: firstName,
            last_name: lastName,
            birthdate,
            address,
          });
          if (response.ok) {
            toast.success("Profile updated successfully!");
          } else {
            toast.error("Something went wrong!");
          }
        }}
        className="mt-4"
      >
        Update Profile
      </Button>

      {/* Deposit Modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full">
            <h2 className="text-lg font-semibold mb-4">Deposit Funds</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Method</label>
              <select
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option>Bank</option>
                <option>GCash</option>
                <option>Paymaya</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDepositOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDeposit(depositAmount);
                }}
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
