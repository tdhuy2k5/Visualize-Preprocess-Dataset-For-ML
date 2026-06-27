import type { Route } from "./+types/eda";
import HistogramChart from "~/eda/charts/HistogramChart";
import { useEffect, useState } from "react";
import { getDuplicatedRows, getMissingRows } from "~/eda/api";
import { useParams } from "react-router";
import FeatureSelection from "~/eda/FeatureSelection";
import { formatNumber } from "~/eda/helper";
import RawDataInspector from "~/eda/RawDataInspector";
import PcaChart from "~/eda/charts/PcaChart";
import { useDataset } from "~/customHooks/useDataset";
import KdeChart from "~/eda/charts/KdeChart";
import EdaCarousel from "~/eda/EdaCarousel";
export function meta({}: Route.MetaArgs) {
  return [{ title: "EDA | The Observational Engine" }];
}
const Eda = function () {
  const datasetId = useParams()?.datasetId ?? "";
  const { info, chooseFeatureHandler, loading } = useDataset(datasetId);
  const [expand, setExpand] = useState(false);
  type rowSumaryStatType = {
    missing: number;
    duplicated: number;
  };
  const [rowSumaryStat, setRowSumaryStat] = useState<rowSumaryStatType>({
    missing: 0,
    duplicated: 0,
  });
  const selectedColumn =
    Object.keys(info.columns).find(
      (key) => info?.columns[key].selected === true,
    ) ?? "";
  const typeList = Object.keys(info.columns).map((key) => ({
    name: key,
    type: info.columns[key].type,
  }));
  useEffect(() => {
    async function fetchData() {
      if (!loading) {
        const [missing, duplicated] = await Promise.all([
          getMissingRows(datasetId, Object.keys(info.columns)),
          getDuplicatedRows(datasetId, Object.keys(info.columns)),
        ]);
        if (missing && duplicated) {
          setRowSumaryStat({
            missing: missing.count,
            duplicated: duplicated.count,
          });
        }
      }
    }
    fetchData();
  }, [loading]);
  function expandHandler() {
    setExpand(!expand);
    return !expand;
  }
  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-surface-dim">
      <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-surface-container-low">
        <div className="flex items-center gap-6">
          <h1 className="font-headline text-xl font-bold text-white tracking-tight">
            Exploratory Data Analysis{" "}
            <span className="text-primary-container ml-2 text-xs font-mono py-1 px-2 bg-primary/20 rounded">
              v0.4.2-stable
            </span>
          </h1>
          <div className="flex bg-surface-container-lowest p-1 rounded-full">
            <button className="px-4 py-1 text-xs font-bold bg-primary text-on-primary rounded-full transition-all">
              Overview
            </button>
            <button className="px-4 py-1 text-xs font-medium text-on-surface-variant hover:text-white transition-all">
              Feature-Specific
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-outline-variant/30 rounded hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-sm">download</span>{" "}
            Export Report
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-surface-container-highest text-primary border border-primary/20 rounded hover:bg-primary/10 transition-all">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              refresh
            </span>{" "}
            Re-calculate
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="grid grid-cols-12 gap-6 max-w-400 mx-auto">
          <div className="col-span-12 grid grid-cols-4 gap-4 mb-2">
            <div className="bg-surface-container rounded-xl p-5 border border-white/5 flex flex-col justify-between">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                Total Observations
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-headline font-extrabold text-white tabular-nums">
                  1,240,492
                </span>
                <span className="text-xs text-primary">+12.4%</span>
              </div>
            </div>
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
                    : "No dedup needed"}
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

          <div className="col-span-9 space-y-6">
            <div className={`${expand ? "hidden" : ""} grid grid-cols-2 gap-6`}>
              <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-sm font-bold text-white">
                    Value Distribution: target_variable
                  </h4>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-white transition-colors">
                    more_vert
                  </span>
                </div>
                <HistogramChart
                  datasetId={datasetId}
                  columnName={selectedColumn}
                  max={info.shape[0]}
                ></HistogramChart>
                <KdeChart
                  datasetId={datasetId}
                  columnName={selectedColumn}
                ></KdeChart>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-sm font-bold text-white">
                    Correlation Matrix (Top 5)
                  </h4>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-white transition-colors">
                    filter_list
                  </span>
                </div>
                {/* <HeatMap */}
                {/*   datasetId={datasetId} */}
                {/*   subset={Object.keys(info.columns)} */}
                {/* ></HeatMap> */}
                <PcaChart datasetId={datasetId}></PcaChart>
              </div>
            </div>
            {/* <RawDataInspector */}
            {/*   expand={expand} */}
            {/*   expandHandler={expandHandler} */}
            {/*   datasetId={datasetId} */}
            {/*   columns={Object.keys(info.columns)} */}
            {/* ></RawDataInspector> */}
            <EdaCarousel datasetId={datasetId}></EdaCarousel>
          </div>

          <div className="col-span-3 space-y-6">
            <FeatureSelection
              typeLists={typeList}
              selectedFeature={selectedColumn}
              chooseHandler={chooseFeatureHandler}
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
    </main>
  );
};
export default Eda;
