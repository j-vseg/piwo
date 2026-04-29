"use client";

import {
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";

export default function Accordion({
  label,
  children,
  disabled,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full bg-white py-3 px-3 flex gap-4 items-center justify-between border-b border-b-gray-300 ${disabled ? "bg-gray-100!" : undefined} ${className}`}
      >
        <p className={`${disabled ? "text-gray-500!" : undefined}`}>{label}</p>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className={`max-h-3! text-gray-400 ${disabled ? "text-gray-500!" : undefined}`}
        />
      </button>
      {isOpen && (
        <div className="bg-white border-b border-b-gray-300 p-4">
          {children}
        </div>
      )}
    </div>
  );
}
