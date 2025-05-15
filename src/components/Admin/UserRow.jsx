import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApproveUser, adminUpdateUserInfo } from "@/api/user/user";

const EditableCell = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const commitChange = async () => {
    setIsEditing(false);
    if (editValue !== value) {
      const success = await onSave(editValue);
      if (!success) {
        setEditValue(value);
      }
    }
  };

  return isEditing ? (
    <Input
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={commitChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          commitChange();
        } else if (e.key === "Escape") {
          setIsEditing(false);
          setEditValue(value);
        }
      }}
      autoFocus
      className="w-full"
    />
  ) : (
    <div
      className="cursor-pointer"
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value || "-"}
    </div>
  );
};

const UserRow = ({ user }) => {
  const queryClient = useQueryClient();

  const handleUpdate = async (field, newValue) => {
    try {
      const response = await adminUpdateUserInfo(user.id, {
        [field]: newValue,
      });
      if (response.ok) {
        toast.success(field.replace(/_/g, " ") + " updated!");
        queryClient.invalidateQueries(["users"]);
        return true;
      } else {
        toast.error(response.error?.message || "Failed to update " + field);
        return false;
      }
    } catch (error) {
      toast.error("Failed to update " + field);
      return false;
    }
  };

  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        <Link to={`/admin/user/${user.id}`} className="underline">
          {user.attributes.email}
        </Link>
      </TableCell>

      <TableCell className="font-medium">
        <EditableCell
          value={user.attributes["user-info"].first_name}
          onSave={(val) => handleUpdate("first_name", val)}
        />
      </TableCell>

      <TableCell className="font-medium">
        <EditableCell
          value={user.attributes["user-info"].last_name}
          onSave={(val) => handleUpdate("last_name", val)}
        />
      </TableCell>

      <TableCell className="font-medium">
        <EditableCell
          value={user.attributes["user-info"].birthdate}
          onSave={(val) => handleUpdate("birthdate", val)}
        />
      </TableCell>

      <TableCell className="font-medium">
        <EditableCell
          value={user.attributes["user-info"].address}
          onSave={(val) => handleUpdate("address", val)}
        />
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
              toast.error(response.error?.message);
            }
          }}
          size="sm"
          className={`${
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
  );
};

export default UserRow;
