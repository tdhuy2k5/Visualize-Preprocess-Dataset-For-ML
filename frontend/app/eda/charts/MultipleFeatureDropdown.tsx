import { useState } from "react";

const MultipleFeatureDropdown = function ({
  selectedFeatures,
  typeLists,
  updateHandler,
}: {
  selectedFeatures: string[];
  typeLists: { name: string; type: string }[];
  updateHandler: (names: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draftFeatures, setDraftFeatures] =
    useState<string[]>(selectedFeatures);
  function toggleFeature(name: string) {
    setDraftFeatures((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name],
    );
  }
  return (
    <div className="relative w-full md:w-64 bg-surface-container border-r border-outline-variant/10 p-6 flex flex-col gap-6">
      <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">tune</span>
        Feature Selection
      </h4>{" "}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-xs"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            Functions
          </span>
          <h3 className="text-on-surface-variant text-xs uppercase font-bold tracking-">
            {draftFeatures.length}
          </h3>
        </div>

        <span className="material-symbols-outlined text-on-surface-variant">
          {open ? "expand_less" : "expand_more"}
        </span>
      </div>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-full z-50
                 bg-surface-container rounded-xl shadow-lg
                 p-2 space-y-2"
        >
          <div className="space-y-2">
            {typeLists.map((e, i) => {
              if (!e.type) {
                return (
                  <div
                    key={i}
                    className="p-2 rounded bg-primary/10 border border-primary/20"
                  >
                    Server issue
                  </div>
                );
              }

              const isSelected = draftFeatures.includes(e.name);

              return (
                <div
                  key={e.name}
                  onClick={() => toggleFeature(e.name)}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors group
                ${
                  isSelected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-surface-variant/40"
                }`}
                >
                  {/* Checkbox icon */}
                  <span
                    className={`material-symbols-outlined text-lg ${
                      isSelected
                        ? "text-primary"
                        : "text-outline group-hover:text-white"
                    }`}
                  >
                    {isSelected ? "check_box" : "check_box_outline_blank"}
                  </span>

                  {/* Name */}
                  <span
                    className={`text-xs truncate ${
                      isSelected
                        ? "text-white"
                        : "text-slate-300 group-hover:text-white"
                    }`}
                  >
                    {e.name}
                  </span>

                  {/* Type */}
                  <span
                    className={`ml-auto text-[10px] font-mono px-1 rounded ${
                      isSelected
                        ? "bg-primary/20 text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    {e.type.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={() => {
                setOpen(false);
                updateHandler(draftFeatures);
              }}
              className="w-full py-2 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider rounded hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Update Features
            </button>
          </div>
        </div>
      )}{" "}
    </div>
  );
};
export default MultipleFeatureDropdown;
