"use client";

import React from "react";
import useAuth from "./useAuth";

const SignedOut = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isAuthenticated = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default SignedOut;
