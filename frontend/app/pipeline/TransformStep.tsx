import type { TransformationRequest } from "~/enTra/api";

const TransformStep = function ({
  step,
  onRemove,
}: {
  step: TransformationRequest;
  onRemove?: () => void;
}) {
  return (
    <div className="relative group flex items-start gap-4">
      <div className="z-10 w-10 h-10 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center text-secondary shrink-0">
        <span className="material-symbols-outlined text-sm">straighten</span>
      </div>
      <div className="flex-1 pt-1">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            Scaling: {step.method}
          </h4>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="material-symbols-outlined text-xs text-on-surface-variant hover:text-error"
            >
              close
            </button>
          </div>
        </div>
        <p className="text-on-surface-variant text-[11px] mt-0.5">
          All columns
        </p>
      </div>
    </div>
  );
};
export default TransformStep;
