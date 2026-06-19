import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute(
  "/_authenticated/change-password"
)({
  component: ChangePassword,
});

function ChangePassword() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const hasLength =
    newPassword.length >= 8;

  const hasUppercase =
    /[A-Z]/.test(newPassword);

  const hasNumber =
    /[0-9]/.test(newPassword);

  const hasSpecial =
    /[^A-Za-z0-9]/.test(newPassword);

  const passwordStrength = [
    hasLength,
    hasUppercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  const strengthText =
    passwordStrength === 4
      ? "Strong 🟢"
      : passwordStrength >= 2
      ? "Medium 🟡"
      : "Weak 🔴";

  const passwordsMatch =
    confirmPassword &&
    newPassword === confirmPassword;

  const handleChangePassword = () => {
    if (!passwordsMatch) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    toast.success(
      "Password updated successfully"
    );
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">

      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/profile"
          className="grid h-11 w-11 place-items-center rounded-xl border"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="text-3xl font-bold">
          Change Password
        </h1>
      </div>

      <div className="rounded-3xl border bg-card p-8 shadow-sm space-y-6">

        <div>
          <label className="font-medium">
            Current Password
          </label>

          <div className="relative mt-2">
            <Input
              type={
                showCurrent
                  ? "text"
                  : "password"
              }
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrent(
                  !showCurrent
                )
              }
              className="absolute right-3 top-3"
            >
              {showCurrent ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="font-medium">
            New Password
          </label>

          <div className="relative mt-2">
            <Input
              type={
                showNew
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(!showNew)
              }
              className="absolute right-3 top-3"
            >
              {showNew ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="mt-3 font-medium">
            Password Strength:
            {" "}
            {strengthText}
          </div>

          <div className="mt-2 space-y-1 text-sm">

            <div>
              {hasLength
                ? "✓"
                : "✗"} Minimum 8 characters
            </div>

            <div>
              {hasUppercase
                ? "✓"
                : "✗"} One Uppercase Letter
            </div>

            <div>
              {hasNumber
                ? "✓"
                : "✗"} One Number
            </div>

            <div>
              {hasSpecial
                ? "✓"
                : "✗"} One Special Character
            </div>

          </div>
        </div>

        <div>
          <label className="font-medium">
            Confirm Password
          </label>

          <div className="relative mt-2">
            <Input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
              className="absolute right-3 top-3"
            >
              {showConfirm ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {confirmPassword && (
            <div className="mt-2 text-sm">
              {passwordsMatch
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </div>
          )}
        </div>

        <Button
          onClick={handleChangePassword}
          className="h-12 w-full rounded-2xl"
        >
          Change Password
        </Button>

      </div>
    </div>
  );
}