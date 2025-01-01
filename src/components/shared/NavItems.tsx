"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar";

const NavItems = () => {
  const pathname = usePathname();

  return (
    // <ul className="md:flex-center flex w-full flex-col items-start gap-5 md:flex-row">
    //   {headerLinks.map((link) => {
    //     const isActive = pathname === link.route;

    //     return (
    //       <li
    //         key={link.route}
    //         className={`${
    //           isActive && "text-blue-600 border-b-2 border-blue-600"
    //         } flex-center p-medium-16 whitespace-nowrap`}
    //       >
    //         <Link href={link.route}>{link.label}</Link>
    //       </li>
    //     );
    //   })}
    // </ul>
    <Menubar className="flex flex-col md:flex-row">
      {headerLinks.map((link) => (
        <MenubarMenu key={link.label}>
          {link.subRoutes && link.subRoutes.length > 0 ? (
            <MenubarTrigger className="cursor-pointer">
              {link.label}
            </MenubarTrigger>
          ) : (
            <Link href={link.route}>
              <MenubarTrigger className="cursor-pointer">
                {link.label}
              </MenubarTrigger>
            </Link>
          )}
          {link.subRoutes && link.subRoutes.length > 0 && (
            <MenubarContent>
              {link.subRoutes.map((subRoute) => (
                <React.Fragment key={subRoute.route}>
                  <Link href={subRoute.route}>
                    <MenubarItem className="cursor-pointer">
                      {subRoute.label}
                    </MenubarItem>
                  </Link>
                  <MenubarSeparator />
                </React.Fragment>
              ))}
            </MenubarContent>
          )}
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

export default NavItems;
