"use client";

import { useRouter } from "next/navigation";
import { logoutLeague } from "@/app/actions/auth";

export function useLogout() {
  const router = useRouter();
  return async () => {
    await logoutLeague();
    router.replace("/login");
    router.refresh();
  };
}
