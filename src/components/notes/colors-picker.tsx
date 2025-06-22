
'use client';

const COLORS = ['#291528', '#000000', '#3A3E3B', '#F0EFF4', '#77A0A9'];

export function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className="flex gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-full border-2 ${value === color ? 'border-primary' : 'border-transparent'}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}