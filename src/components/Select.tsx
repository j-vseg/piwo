"use client";

import { Category } from "@/types/category";
import { getEventColor } from "@/utils/getEventColor";
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useId } from "react";

type SelectProps = {
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  error?: string;
  required?: boolean;
  value?: string;
  variant?: "category" | "recurrence";
  id?: string;
};

export default function Select({
  onChange,
  options,
  label,
  value,
  error,
  required = true,
  variant = "category",
  id,
}: SelectProps) {

  const _onChange = useCallback(
    (value?: string) => {
      onChange(value || "");
    },
    [onChange],
  );

  return (
    <div>
      {label && (
        <label className="text-[12px]!" htmlFor={id}>
          {label}
          {required && "*"}
        </label>
      )}
      <div
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        className="flex flex-row gap-2 overflow-x-auto my-0.5 items-center"
      >
        {required == false && (
          <button
            onClick={() => _onChange()}
            type="button"
            aria-label={`Deselect all`}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="max-h-4!"
              aria-hidden="true"
            />
          </button>
        )}
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`px-4 py-1 text-sm rounded-2xl break-keep whitespace-nowrap ${
              option === value
                ? variant === "recurrence"
                  ? "bg-pastelBlue"
                  : getEventColor(option as Category)
                : "bg-white"
            }`}
            onClick={() => _onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {error && (
        <div
          className="flex flex-row gap-2 items-center mt-1"
          role="alert"
          id={`${id}-error`}
        >
          <FontAwesomeIcon
            className="text-error max-h-4!"
            icon={faCircleInfo}
          />
          <p className="m-0 p-0 text-error text-[12px]! break-normal">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
