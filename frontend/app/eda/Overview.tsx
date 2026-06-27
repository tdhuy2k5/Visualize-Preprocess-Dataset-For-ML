import type { columnsInfo } from "./api";
import type { rowSumaryStatType } from "./EdaCarousel";
import FeatureSelection from "./FeatureSelection";
import { formatNumber } from "./helper";

const EdaOverview = function ({
  rowSumaryStat,
  info,
  chooseFeatureHandler,
}: {
  rowSumaryStat: rowSumaryStatType;
  info: columnsInfo;
  chooseFeatureHandler: (name: string) => void;
}) {
  const typeList = Object.keys(info.columns).map((key) => ({
    name: key,
    type: info.columns[key].type,
  }));
  const selectedColumn =
    Object.keys(info.columns).find(
      (key) => info?.columns[key].selected === true,
    ) ?? "";

  return (
    <div className="carousel-container">
      <div className="carousel-slide custom-scrollbar">
        <div className="max-w-350 mx-auto">
          <div className="col-span-12 grid grid-cols-3 gap-4 mb-2 pb-8 pt-8">
            <div className="bg-surface-container rounded-xl p-5 border border-white/5 flex flex-col justify-between">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                Missing Values
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-headline font-extrabold text-error tabular-nums">
                  {formatNumber(rowSumaryStat.missing)}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {rowSumaryStat.missing / info.shape[0] > 0.05
                    ? "High impact"
                    : "Low impact"}
                </span>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl p-5 border border-white/5 flex flex-col justify-between">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                Duplicate Rows
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-headline font-extrabold text-white tabular-nums">
                  {rowSumaryStat.duplicated}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {rowSumaryStat.duplicated / info.shape[0] > 0.05
                    ? "Dedup suggested"
                    : "No dedup needed"}{" "}
                </span>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl p-5 border border-white/5 flex flex-col justify-between">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                Feature Count
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-headline font-extrabold text-tertiary tabular-nums">
                  {info.shape[1]}
                </span>
                <span className="text-xs text-on-surface-variant">
                  Mixed types
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FeatureSelection
              typeLists={typeList}
              selectedFeature={selectedColumn}
              chooseHandler={(name: string | undefined) =>
                name && chooseFeatureHandler(name)
              }
            ></FeatureSelection>
            <div className="bg-surface-container rounded-xl p-6 border border-white/5">
              <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  summarize
                </span>{" "}
                Summary Statistics
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">Mean</span>
                  <span className="text-xs font-mono text-white tabular-nums">
                    {selectedColumn
                      ? info.columns[selectedColumn].mean?.toFixed(2)
                      : "--"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">
                    Median
                  </span>
                  <span className="text-xs font-mono text-white tabular-nums">
                    {selectedColumn
                      ? info.columns[selectedColumn]["50%"]?.toFixed(2)
                      : "--"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">
                    Std Dev
                  </span>
                  <span className="text-xs font-mono text-white tabular-nums">
                    {selectedColumn
                      ? info.columns[selectedColumn].std?.toFixed(2)
                      : "--"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">Max</span>
                  <span className="text-xs font-mono text-tertiary tabular-nums">
                    {selectedColumn
                      ? info.columns[selectedColumn].max?.toFixed(2)
                      : "--"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">Min</span>
                  <span className="text-xs font-mono text-white tabular-nums">
                    {selectedColumn
                      ? info.columns[selectedColumn].min?.toFixed(2)
                      : "--"}
                  </span>
                </div>
                <div className="mt-4 p-3 rounded bg-surface-container-low border border-outline-variant/20">
                  <p className="text-[10px] text-on-surface-variant italic leading-relaxed">
                    The distribution appears approximately normal with slight
                    right-tail outliers. Recommend log transformation for linear
                    models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EdaOverview;
