import { EncodingRequest, type EncodingMethodType } from "~/enTra/api";

const EncodingStep = function ({
  item,
  onRemove,
}: {
  item: EncodingRequest;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative group flex items-start gap-4">
        {/* Circle with icon */}
        <div className="z-10 w-10 h-10 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center text-secondary shrink-0">
          <span className="material-symbols-outlined text-sm">category</span>
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Encoding: {formatMethod(item.method)}
            </h4>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="material-symbols-outlined text-xs text-on-surface-variant hover:text-error"
                >
                  close
                </button>
              )}
            </div>
          </div>

          {/* Columns/target info */}
          <p className="text-on-surface-variant text-[11px] mt-0.5">
            {item.target || item.column || "I dont know :3"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Optional helper to format the method nicely
function formatMethod(method: EncodingMethodType) {
  return method
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
export default EncodingStep;
