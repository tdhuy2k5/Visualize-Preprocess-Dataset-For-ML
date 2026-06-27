import type { Func } from "./WrapFunction";

const ActiveFunction = function ({
  index,
  draft,
  cancelFuncHandler,
  updateDraftParamHandler,
  updateDraftTypeHandler,
  saveFuncHandler,
}: {
  index: number;
  draft: Func;
  cancelFuncHandler: VoidFunction;
  updateDraftParamHandler: (value: string) => void;
  updateDraftTypeHandler: (value: string) => void;
  saveFuncHandler: (index: number) => void;
}) {
  const func_ops = ["log", "pow"];
  const trigo_ops = ["sin", "cos", "tan", "cot"];
  return (
    <div className="flex items-center gap-4">
      {/* ACTIVE (your "2." UI) */}
      <div className="w-8 h-8 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
        {index}
      </div>

      <div className="flex-1 bg-surface-container-highest p-5 rounded-lg border border-primary ring-1 ring-primary/20">
        <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
          {/* function select */}
          <div className="w-full md:w-1/3">
            <label className="block text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">
              Select Function
            </label>
            <div className="relative">
              <select
                value={draft.type}
                onChange={(e) => updateDraftTypeHandler(e.target.value)}
                className="w-full bg-surface-container-lowest text-on-surface py-2.5 px-3 rounded border border-outline-variant/30 appearance-none focus:outline-none focus:border-primary"
              >
                {[...func_ops, ...trigo_ops].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>

          {/* param */}

          <div className="flex-1">
            <label className="block text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">
              Parameters
            </label>
            <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-on-surface-variant font-mono text-sm px-2">
                {`${draft.type}( result ,`}
              </span>
              <input
                className="w-12 bg-surface-container-low text-primary text-center font-mono font-bold border-none rounded p-1 focus:ring-1 focus:ring-primary"
                type="text"
                onChange={(e) => updateDraftParamHandler(e.target.value)}
                value={draft.param}
              />
              <span className="text-on-surface-variant font-mono text-sm">
                )
              </span>
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                saveFuncHandler(index);
              }}
              className={` ${draft.param ? "text-on-primary bg-primary" : "text-error bg-surface-container-low"} h-10.5 px-4 rounded font-bold text-sm active:scale-95 transition-transform`}
            >
              Apply
            </button>
            <button
              onClick={() => {
                cancelFuncHandler();
              }}
              className="flex items-center justify-center bg-surface-container-low text-on-surface-variant h-10.5 px-3 rounded border border-outline-variant/20 hover:bg-error/10 hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ActiveFunction;
