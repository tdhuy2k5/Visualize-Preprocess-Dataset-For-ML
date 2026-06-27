import { useState } from "react";
import { featureEngineering, type FeatureEngRequest } from "./api";

type GroupByProps = {
  datasetId: string;
  columns: string[];
  refreshHandler: VoidFunction;
};

export const GroupBy = ({
  datasetId,
  columns,
  refreshHandler,
}: GroupByProps) => {
  const AGG_OPTIONS = ["mean", "sum", "count", "min", "max", "std"];

  const [form, setForm] = useState({
    groupBy: [columns[0]], // default selected
    targetColumn: "",
    newColumnName: "",
    aggFunc: "mean",
  });

  const [nameTouched, setNameTouched] = useState(false);
  const isNameError = nameTouched && form.newColumnName.trim() === "";
  async function clearAll() {
    setForm({
      groupBy: [columns[0]], // default selected
      targetColumn: "",
      newColumnName: "",
      aggFunc: "mean",
    });
  }
  async function executeOperation() {
    if (!form.targetColumn || !form.newColumnName || !form.groupBy) {
      return;
    }
    const req: FeatureEngRequest = {
      operation: "groupby_agg",
      new_col: form.newColumnName,
      params: {
        group_col: form.groupBy,
        agg_col: form.targetColumn,
        agg_func: form.aggFunc,
      },
    };
    await featureEngineering(datasetId, req);
    refreshHandler();
  }

  // Handle input changes
  const handleNewColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, newColumnName: e.target.value });
  };

  const handleTargetColumnChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setForm({ ...form, targetColumn: e.target.value });
  };

  const removeGroupBy = (col: string) => {
    setForm({
      ...form,
      groupBy: form.groupBy.filter((c) => c !== col),
    });
  };

  const addGroupBy = (col: string) => {
    if (col && !form.groupBy.includes(col)) {
      setForm({
        ...form,
        groupBy: [...form.groupBy, col],
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-1 overflow-y-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-white tracking-tight">
            Custom Expression Builder
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Configure logic gates and text transformations for the preprocessing
            stream.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              clearAll();
            }}
            className="px-4 py-2 bg-surface-container-high rounded-md text-xs font-bold text-secondary hover:bg-surface-bright transition-colors"
          >
            CLEAR ALL
          </button>
          <button
            onClick={() => {
              executeOperation();
            }}
            className="px-4 py-2 bg-primary-container text-primary rounded-md text-xs font-bold border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            EXECUTE
          </button>
        </div>
      </div>
      <div className="bg-surface-container-low rounded-2xl p-1 space-y-10 relative overflow-hidden">
        {/* Group By Columns */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-tertiary rounded-full"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Group By Columns
            </h3>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4 flex flex-wrap gap-2 min-h-14 items-center">
            {form.groupBy.map((col) => (
              <span
                key={col}
                className="bg-surface-container-highest text-primary px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-2 border border-primary/20"
              >
                {col}{" "}
                <span
                  className="material-symbols-outlined text-sm cursor-pointer"
                  onClick={() => removeGroupBy(col)}
                >
                  close
                </span>
              </span>
            ))}
            <select
              className="text-on-surface-variant hover:text-white transition-colors px-2 py-1 text-xs flex items-center gap-1 appearance-none"
              value=""
              onChange={(e) => addGroupBy(e.target.value)}
            >
              <option value="">+ Add column</option>
              {columns
                .filter((col) => !form.groupBy.includes(col))
                .map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Target Column */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
                Target Column
              </h3>
            </div>
            <select
              value={form.targetColumn}
              onChange={handleTargetColumnChange}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
            >
              <option value="">Select column</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* New Column Name */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-secondary rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
                New Column Name
              </h3>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={form.newColumnName}
                onChange={handleNewColumnChange}
                onBlur={() => setNameTouched(true)}
                placeholder="Name"
                className={`flex-1 bg-surface-container-lowest border rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-1 outline-none transition-all ${
                  isNameError
                    ? "border-error ring-error"
                    : "border-outline-variant/20 focus:ring-primary"
                }`}
              />
              {isNameError && (
                <p className="text-error text-xs">Column name is required</p>
              )}
            </div>
          </div>
        </div>

        {/* Aggregation Functions */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-tertiary-fixed rounded-full"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
              Aggregation Functions
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGG_OPTIONS.map((agg) => {
              const isActive = form.aggFunc === agg;

              return (
                <div
                  key={agg}
                  onClick={() => setForm((f) => ({ ...f, aggFunc: agg }))}
                  className={`
        cursor-pointer p-4 rounded-xl border transition-all text-center
        ${
          isActive
            ? "bg-primary/20 border-primary text-primary"
            : "bg-surface-container-highest/30 border-outline-variant/10 hover:bg-surface-container-highest/60"
        }
      `}
                >
                  <span className="text-sm font-medium capitalize">{agg}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBy;
