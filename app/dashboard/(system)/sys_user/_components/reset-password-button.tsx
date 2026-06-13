"use client";

import { KeyIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useActionState, useRef } from "react";
import { resetPassword, type ResetPasswordState } from "../_lib/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const initialState: ResetPasswordState = {};

export function ResetPasswordButton({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const submittedRef = useRef(false);
  const [state, formAction, isPending] = useActionState(
    resetPassword.bind(null, userId),
    initialState,
  );

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Close dialog on successful reset
  useEffect(() => {
    if (submittedRef.current && state && !state.errors && state.message === null) {
      setOpen(false);
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (passwordValue !== confirmPassword) {
      e.preventDefault();
      setConfirmError("Passwords do not match.");
      return;
    }
    setConfirmError(null);
    submittedRef.current = true;
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      submittedRef.current = false;
      setPasswordValue("");
      setConfirmPassword("");
      setConfirmError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="rounded-md border p-2 hover:bg-gray-100"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Reset Password</span>
            <KeyIcon className="w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Reset Password</TooltipContent>
      </Tooltip>
      <DialogContent showCloseButton={false} className="bg-white p-6">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter a new password for this user. It must be at least 6 characters.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`password-${userId}`} className="text-sm font-medium">
              Password
            </label>
            <Input
              id={`password-${userId}`}
              name="password"
              type="password"
              placeholder="New password"
              className="mt-1 block w-full"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              required
            />
            {state.errors?.password && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.password[0]}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`confirm-${userId}`} className="text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id={`confirm-${userId}`}
              type="password"
              placeholder="Confirm new password"
              className="mt-1 block w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmError && (
              <p className="mt-1 text-sm text-red-500">{confirmError}</p>
            )}
          </div>
          {state.message && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
