import { Input } from "@/components/ui/input";
import { useCallback } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value}
        onChange={handleChange}
        className="h-10 w-16 p-1 cursor-pointer"
      />
      <span className="text-sm">{value}</span>
    </div>
  );
}