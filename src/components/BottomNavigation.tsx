"use client";

import { faGear, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", icon: faHouse, href: "/home" },
  { label: "Instellingen", icon: faGear, href: "/settings" },
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 h-16 flex justify-around items-center bg-black/30 backdrop-blur-md rounded-full shadow-md px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
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
        );
      })}
    </nav>
  );
}
