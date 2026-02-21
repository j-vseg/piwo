"use client";

import { Category } from "@/types/category";
import { getEventColor } from "@/utils/getEventColor";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useId } from "react";

type SelectProps = {
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  error?: string;
  required?: boolean;
  value?: string;
};

export default function Select({
  onChange,
  options,
  label,
  value,
  error,
  required = false,
}: SelectProps) {
  const id = useId();
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
        className="flex flex-row gap-2 overflow-x-auto my-2 pb-4 items-center"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`px-4 py-1 text-sm rounded-2xl break-keep whitespace-nowrap ${
              option === value ? getEventColor(option as Category) : "bg-white"
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
