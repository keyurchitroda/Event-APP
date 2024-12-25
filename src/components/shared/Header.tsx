"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import logo from "../../../public/assets/images/logo.svg";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { getCookie, removeCookie } from "@/apiConfig/cookies";
import { defaultAuthTokenString, defaultTokenString } from "@/helpers/helper";
import { useRouter } from "next/navigation";
import SignedIn from "../authcheck/SignedIn";
import SignedOut from "../authcheck/SignedOut";
import { signoutService } from "@/services/authService";
import { Loader2 } from "lucide-react";

const Header = () => {
  const [loader, setLoader] = React.useState(false);
  const router = useRouter();

  const onLogout = async () => {
    setLoader(true);
    await signoutService();
    await removeCookie(defaultAuthTokenString);
    router.push("/login");
    setLoader(false);
  };

  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image src={logo} width={128} height={38} alt="logo" />
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
          <MobileNav />
        </SignedIn>
        <div className="flex w-32 justify-end gap-3">
          {/* <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild={true} className="rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut> */}
          <SignedIn>
            <Button
              disabled={loader}
              asChild={true}
              className="rounded-full"
              size="lg"
            >
              <Link onClick={() => onLogout()} href="/">
                {loader && <Loader2 className="animate-spin" />}
                Logout
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button asChild={true} className="rounded-full" size="lg">
              <Link href="/login">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
