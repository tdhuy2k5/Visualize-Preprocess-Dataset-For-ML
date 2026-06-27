import { useEffect, useState } from "react";
import { Options } from "./EngineerOptions";

const OperationsList = function ({
  selectOptionHandler,
}: {
  selectOptionHandler: (option: string) => void;
}) {
  const [selected, setSelected] = useState<string>(Options[0].name);
  useEffect(() => {
    selectOptionHandler(selected);
  }, [selected]);

  return (
    <div className="bg-surface-container rounded-xl p-4 shadow-sm border border-outline-variant/5">
      <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4">
        Operations List
      </h3>

      <div className="space-y-2">
        {Options.map((option) => {
          const isSelected = selected === option.name;

          return (
            <button
              key={option.name}
              onClick={() => setSelected(option.name)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isSelected
                  ? "bg-surface-container-high text-on-surface border border-primary/20"
                  : "hover:bg-surface-container-high/50 text-on-surface-variant"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined ${
                    isSelected ? "text-primary" : "text-sm"
                  }`}
                >
                  {option.icon}
                </span>
                <span className="text-xs font-semibold">{option.name}</span>
              </div>

              <span className="material-symbols-outlined text-xs">
                {isSelected ? "radio_button_checked" : "chevron_right"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OperationsList;
