import type { typeListType } from "./charts/helper";

const FeatureSelection = function ({
  typeLists,
  selectedFeature,
  chooseHandler,
}: {
  typeLists: typeListType[];
  selectedFeature: string;
  chooseHandler: (e: string | undefined) => void;
}) {
  return (
    <div className="bg-surface-container rounded-xl p-6 border border-white/5 border-l-amber- h-full flex flex-col max-h-[40vh] overflow-y-auto">
      <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">tune</span> Feature
        Selection
      </h4>
      <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
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
    </div>
  );
};
export default FeatureSelection;
