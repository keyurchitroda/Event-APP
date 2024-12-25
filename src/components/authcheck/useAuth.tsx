"use client";

import { useState, useEffect } from "react";
import { getCookie } from "@/apiConfig/cookies";
import { defaultAuthTokenString } from "@/helpers/helper";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getCookie(defaultAuthTokenString);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
