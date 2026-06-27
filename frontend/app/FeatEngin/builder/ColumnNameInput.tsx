export default function ColumnNameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const isError = !value || value.trim() === "";

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-base">label</span>
        New Column Name
      </h2>

      <div className="flex items-center gap-2 bg-surface-container rounded p-6">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full text-primary font-mono font-bold 
            bg-surface-container-lowest border-none rounded p-1
            focus:outline-none focus:ring-2
            ${isError ? "ring-2 ring-error focus:ring-error" : "focus:ring-primary"}
          `}
        />
        {isError && (
          <p className="text-error text-xs">Column name is required</p>
        )}
      </div>
    </div>
  );
}
