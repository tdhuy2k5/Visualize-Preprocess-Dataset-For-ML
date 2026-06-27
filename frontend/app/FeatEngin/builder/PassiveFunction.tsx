import type { Func } from "./WrapFunction";

const PassiveFunction = function ({
  fn,
  index,
  removeFuncHandler,
  editFuncHandler,
}: {
  fn: Func;
  index: number;
  removeFuncHandler: (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  editFuncHandler: (fn: Func, index: number) => void;
}) {
  return (
    <div
      key={fn.id}
      onClick={() => {
        editFuncHandler(fn, index);
      }}
      className="flex items-center justify-between bg-surface-container-high px-6 py-4 rounded-xl group hover:bg-surface-bright/40 transition-colors"
    >
      <div className="flex items-center gap-4">
        <span className="text-on-surface-variant font-mono text-sm">
          {index + 1}.
        </span>
        <div className="flex items-center gap-2">
          <span className="text-tertiary font-mono">{fn.type}(</span>
          <span className="px-2 py-0.5 bg-surface-container-lowest rounded text-on-surface-variant font-mono text-xs">
            ?
          </span>
          <span className="text-on-surface-variant font-mono">,</span>
          <span className="text-[#7bd0ff] font-mono">{fn.param}</span>
          <span className="text-tertiary font-mono">)</span>
        </div>
      </div>
      <button
        className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-xs"
        onClick={(e) => {
          removeFuncHandler(e, index);
        }}
      >
        <span className="material-symbols-outlined text-sm" data-icon="delete">
          delete
        </span>
        Remove
      </button>
    </div>
  );
};
export default PassiveFunction;
