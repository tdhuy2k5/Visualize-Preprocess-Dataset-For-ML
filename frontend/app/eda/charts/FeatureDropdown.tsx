import { useState } from "react";
import type { typeListType } from "./helper";

const FeatureDropdown = function ({
  typeLists,
  selectedFeature,
  chooseHandler,
}: {
  typeLists: typeListType[];
  selectedFeature: string;
  chooseHandler: (e: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full md:w-64 bg-surface-container border-r border-outline-variant/10 p-6 flex flex-col gap-6">
      <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">tune</span> Feature
        Selection
      </h4>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-xs"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            data_object
          </span>
          <h3 className="text-on-surface-variant text-xs uppercase font-bold tracking-">
            {selectedFeature}
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
          {typeLists.map((e, i) => {
            if (!e.type) {
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded bg-primary/10 border border-primary/20 cursor-pointer"
                >
                  Please consider hoping our server is working fine
                </div>
              );
            }
            if (e.name === selectedFeature) {
              return (
                <div
                  key={e.name}
                  className="flex items-center gap-3 p-2 rounded bg-primary/10 border border-primary/20 cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-full bg-primary shrink-0"></div>
                  <span className="text-xs text-white truncate" title={e.name}>
                    {e.name}
                  </span>
                  <span className="ml-auto text-[10px] bg-primary/20 px-1 rounded font-mono">
                    {e.type.toUpperCase()}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded hover:bg-surface-variant/40 cursor-pointer group transition-colors"
                onClick={() => {
                  setOpen(false);
                  chooseHandler(e.name);
                }}
              >
                <div className="w-3 h-3 rounded-full border border-outline shrink-0"></div>
                <span
                  className="text-xs text-slate-300 group-hover:text-white truncate"
                  title={e.name}
                >
                  {e.name}
                </span>
                <span className="ml-auto text-[10px] text-slate-500 font-mono">
                  {e.type.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}{" "}
    </div>
  );
};
export default FeatureDropdown;
