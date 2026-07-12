type AuthInputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
};

export function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete
}: AuthInputProps) {
  const hasError = Boolean(error);

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={hasError}
        aria-describedby={`${id}-message`}
        className={`field-input ${
          hasError
            ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
            : ""
        }`}
      />
      <p
        id={`${id}-message`}
        className={`mt-2 min-h-6 text-sm ${
          hasError ? "text-rose-500" : "text-slate-400"
        }`}
      >
        {error ?? hint ?? " "}
      </p>
    </div>
  );
}
