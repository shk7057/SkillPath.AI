"use client";

import { useState } from "react";

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  label: string;
  placeholder: string;
};

export function TagInput({
  tags,
  onChange,
  label,
  placeholder
}: TagInputProps) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const nextValue = value.trim();

    if (!nextValue) return;
    if (tags.includes(nextValue)) {
      setValue("");
      return;
    }

    onChange([...tags, nextValue]);
    setValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="field-label">
        {label}
      </label>

      <div className="surface-panel rounded-[1.5rem] bg-white/90 p-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-mist px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-sky/60"
            >
              {tag}
              <span className="text-slate-400">x</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addTag();
              }
            }}
              className="field-input py-3"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-secondary px-5 py-3"
            >
              Add skill
            </button>
        </div>
      </div>
    </div>
  );
}
