"use client";

import { useAuth } from "@/contexts/auth";
import { fetchAllAccountNotApprovedUsers } from "@/services/firebase/accounts";
import { Role } from "@/types/role";
import {
  fa1,
  fa2,
  fa3,
  fa4,
  fa5,
  fa6,
  fa7,
  fa8,
  fa9,
  faGear,
  faHouse,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { skipToken, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

export function BottomNavigation() {
  const { user, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { label: "Home", icon: faHouse, href: "/home" },
    ...(role === Role.Advisor || role === Role.Chairman
      ? [{ label: "Beheren", icon: faPeopleGroup, href: "/manage" }]
      : []),
    { label: "Instellingen", icon: faGear, href: "/settings" },
  ];

  const { data, isError } = useQuery({
    queryKey: ["not-approved-user-number"],
    queryFn:
      user && (role === Role.Advisor || role === Role.Chairman)
        ? () => fetchAllAccountNotApprovedUsers()
        : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 h-16 flex justify-evenly items-center bg-black/30 backdrop-blur-md rounded-full shadow-md px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <div key={item.href} className="relative w-20">
            {item.href === "/manage" && !isError && data && data.length > 0 && (
              <div className="absolute -top-1 right-3 bg-error rounded-full w-4.5 h-4.5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={getFontAwesomeIconForBadge(data.length)}
                  size="2xs"
                  className={`max-h-2! text-white font-bold`}
                  shake
                />
                {data.length > 9 && (
                  <p className="text-white text-[8px]! -ml-1">+</p>
                )}
              </div>
            )}
            <div
              key={item.href}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer
              ${isActive ? "text-primary" : "text-white"}`}
              onClick={() => router.push(item.href)}
            >
              <FontAwesomeIcon
                icon={item.icon}
                size="lg"
                className={`max-h-5! ${isActive ? "text-primary" : ""}`}
              />
              <span
                className={`text-xs font-semibold ${isActive ? "text-primary" : ""}`}
              >
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function getFontAwesomeIconForBadge(number: number) {
  switch (number) {
    case 1:
      return fa1;
    case 2:
      return fa2;
    case 3:
      return fa3;
    case 4:
      return fa4;
    case 5:
      return fa5;
    case 6:
      return fa6;
    case 7:
      return fa7;
    case 8:
      return fa8;
    case 9:
      return fa9;
    default:
      return fa9;
  }
}