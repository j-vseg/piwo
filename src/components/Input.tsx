import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, InputHTMLAttributes, useCallback, useId } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  onChange: (value: string) => void;
  label: string;
  error?: string;
};

export default function Input({
  onChange,
  label,
  required = true,
  error,
  value,
  ...inputProps
}: InputProps) {
  const id = useId();

  const _onChange = useCallback(
    (value?: string) => {
      onChange(value || "");
    },
    [onChange],
  );

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      _onChange(e.target.value);
    },
    [_onChange],
  );

  return (
    <div>
      {label && (
        <label className="text-[12px]!" htmlFor={id}>
          {label}
          {required && "*"}
        </label>
      )}
      <div className="flex flex-col flex-1">
        <input
          id={id}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`m-0 py-2 text-[14px]!] break-all border-b w-full ${error && "border-error!"}`}
          value={value}
          onChange={onInputChange}
          {...inputProps}
        />
        {error && (
          <div
            className="flex flex-row gap-2 items-center mt-1"
            role="alert"
            id={`${id}-error`}
          >
            <FontAwesomeIcon
              className="text-error"
              size="sm"
              icon={faCircleInfo}
            />
            <p className="m-0 p-0 text-[12px]! text-error break-normal">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
