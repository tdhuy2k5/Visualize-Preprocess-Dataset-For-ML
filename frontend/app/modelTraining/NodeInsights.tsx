import type { DecisionTreeNodeVisualization } from "./api";

const NodeInsights = function ({
  totalSample,
  node,
  setSelectedNode,
  addSplitNode,
}: {
  totalSample: number;
  node: DecisionTreeNodeVisualization | null;
  setSelectedNode: (n: string | null) => void;
  addSplitNode: (id: string) => void;
}) {
  return (
    <div
      className={`absolute top-0 right-0 h-full w-96 bg-surface-container border-l border-outline-variant/10 shadow-[-24px_0_48px_rgba(0,0,0,0.5)] transform ${node || "translate-x-full"} transition-transform duration-300 ease-in-out z-20 flex flex-col`}
      id="insight-panel"
    >
      {node && (
        <>
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
            <div>
              <h3 className="font-headline font-bold text-xl text-white">
                Node Insight
              </h3>
              <p
                className="text-xs text-outline font-medium tracking-widest"
                id="insight-id"
              >
                ID: {node.id}
              </p>
            </div>
            <button
              className="text-on-surface-variant hover:text-white transition-colors"
              onClick={() => {
                setSelectedNode(null);
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
                <p className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">
                  Samples
                </p>
                <p
                  className="text-2xl font-headline font-extrabold text-primary"
                  id="insight-samples"
                >
                  {node.samples}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  {(node.samples / totalSample) * 100}% of total set
                </p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
                <p className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">
                  Gini Impurity
                </p>
                <p
                  className="text-2xl font-headline font-extrabold text-tertiary"
                  id="insight-gini"
                >
                  {node.gini}
                </p>
                <div className="w-full h-1 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-tertiary"
                    id="gini-gauge"
                    style={{ width: "4.5%" }}
                  ></div>
                </div>
              </div>
            </div>
            {node.type === "split" && (
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">
                    bar_chart
                  </span>
                  Feature Gini
                </h4>
                <div className="space-y-4">
                  {Object.keys(node.gini_history).map((val) => (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-on-surface-variant">{val}</span>
                        <span className="text-white font-bold" id="dist-a-val">
                          {node.gini_history[val]}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-700"
                          id="dist-a-bar"
                          style={{ width: `${node.gini_history[val] * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}{" "}
            <div>
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">
                  bar_chart
                </span>
                Label Distribution
              </h4>
              <div className="space-y-4">
                {node.dist.map((val, i) => (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-on-surface-variant">{i}</span>
                      <span className="text-white font-bold" id="dist-a-val">
                        {Math.ceil((val / node.samples) * 10000) / 100}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-700"
                        id="dist-a-bar"
                        style={{ width: `${(val / node.samples) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/10">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-outline text-lg">
                  info
                </span>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">
                    Heuristic Recommendation
                  </p>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    This node displays high purity. Statistical significance of
                    further splitting is low (p=0.42). Consider pruning or early
                    stopping at this depth.
                  </p>
                </div>
              </div>
            </div>
            {node.type === "leaf" && (
              <div className="pt-4">
                <button
                  className="w-full py-4 bg-linear-to-br from-primary to-on-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(123,208,255,0.2)] active:scale-95 group"
                  onClick={() => {
                    addSplitNode(node.id);
                  }}
                >
                  <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
                    add_circle
                  </span>
                  Begin New Split
                </button>
              </div>
            )}{" "}
          </div>
        </>
      )}
    </div>
  );
};
export default NodeInsights;
