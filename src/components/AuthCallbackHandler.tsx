"use client";

import { useEffect } from "react";
import { consumeAuthTokenFromUrl } from "@/lib/auth-token";

export function AuthCallbackHandler() {
  useEffect(() => {
    consumeAuthTokenFromUrl();
  }, []);

  return null;
}
