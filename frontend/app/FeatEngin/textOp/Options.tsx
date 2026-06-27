import { useEffect, useState } from "react";

const Options = function ({
  columns,
  isDisable,
  updateOperationHandler,
}: {
  columns: string[];
  isDisable: boolean;
  updateOperationHandler: (c: string, nc: string) => void;
}) {
  const [form, setForm] = useState({
    column: "",
    new_col: "",
  });
  const isError = !form.new_col || form.new_col.trim() === "";
  useEffect(() => {
    updateOperationHandler(form.column, form.new_col);
  }, [form]);
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 block tracking-widest">
          Target Column
        </label>
        <select
          onChange={(e) => setForm((f) => ({ ...f, column: e.target.value }))}
          disabled={isDisable}
          className="w-full bg-surface-container-lowest border-outline-variant/30 rounded-lg text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary h-10 px-3 transition-all"
        >
          {columns.map((col) => (
            <option>{col}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 block tracking-widest">
          Add Name of New Column
        </label>
        <div className="flex items-center gap-2 bg-surface-container rounded">
          <input
            disabled={isDisable}
            onChange={(e) =>
              setForm((f) => ({ ...f, new_col: e.target.value }))
            }
            type="text"
            value={form.new_col}
            className={`
            w-full text-on-surface font-mono font-bold 
            bg-surface-container-lowest border-none rounded p-1
            focus:outline-none focus:ring-1
            ${isError ? "ring-1 ring-error focus:ring-error" : "focus:ring-primary"}
          `}
          />
          {isError && (
            <p className="text-error text-xs">Column name is required</p>
          )}
        </div>{" "}
      </div>
    </div>
  );
};
export default Options;
