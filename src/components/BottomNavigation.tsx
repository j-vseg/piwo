"use client";

import { useAuth } from "@/contexts/auth";
import { Role } from "@/types/role";
import {
  fa1,
  faGear,
  faHouse,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";

export function BottomNavigation() {
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { label: "Home", icon: faHouse, href: "/home" },
    ...(role === Role.Advisor || role === Role.Chairman
      ? [{ label: "Beheren", icon: faPeopleGroup, href: "/manage" }]
      : []),
    { label: "Instellingen", icon: faGear, href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 h-16 flex justify-evenly items-center bg-black/30 backdrop-blur-md rounded-full shadow-md px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <div key={item.href} className="relative w-20">
            {item.href === "/manage" && (
              <div className="absolute -top-1 right-3 bg-error rounded-full w-4 h-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={fa1}
                  size="2xs"
                  className={`max-h-2! text-white font-bold`}
                  shake
                />
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
