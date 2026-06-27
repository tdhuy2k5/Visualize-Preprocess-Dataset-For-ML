import { useEffect, useState } from "react";
import EdaOverview from "./Overview";
import Charts from "./Charts";
import { useDataset } from "~/customHooks/useDataset";
import { getDuplicatedRows, getMissingRows } from "./api";
import RawDataInspector from "./RawDataInspector";
export type rowSumaryStatType = {
  missing: number;
  duplicated: number;
};

const EdaCarousel = function ({ datasetId }: { datasetId: string }) {
  type pageList = "Overview" | "Charts" | "Inspector";
  const [currentPage, setCurrentPage] = useState<pageList>("Overview");
  const [refresh, setRefresh] = useState(true);
  const { info, chooseFeatureHandler, loading, refreshHandler } =
    useDataset(datasetId);
  const [expand, setExpand] = useState(false);
  const [rowSumaryStat, setRowSumaryStat] = useState<rowSumaryStatType>({
    missing: 0,
    duplicated: 0,
  });
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

  function changeHandler(name: pageList) {
    setCurrentPage(name);
  }

  return (
    <>
      <main className="flex-1 overflow-hidden flex flex-col bg-surface-dim relative">
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-surface-container-low z-20">
          <div className="flex w-full justify-around items-center gap-6">
            <h1 className="font-headline text-xl font-bold text-white tracking-tight">
              Exploratory Data Analysis{" "}
            </h1>
            <div className="flex bg-surface-container-lowest p-1 rounded-full">
              <button
                className={`px-4 py-1 text-xs ${currentPage === "Overview" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant font-medium"} hover:text-white transition-all cursor-pointer rounded-full`}
                onClick={() => {
                  changeHandler("Overview");
                }}
              >
                Overview
              </button>
              <button
                className={`px-4 py-1 text-xs ${currentPage === "Charts" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant font-medium"} hover:text-white transition-all cursor-pointer rounded-full`}
                onClick={() => {
                  changeHandler("Charts");
                }}
              >
                Charts
              </button>
              <button
                className={`px-4 py-1 text-xs ${currentPage === "Inspector" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant font-medium"} hover:text-white transition-all cursor-pointer rounded-full`}
                onClick={() => {
                  changeHandler("Inspector");
                }}
              >
                Inspector
              </button>
            </div>
            <button
              onClick={() => {
                refreshHandler();

                setRefresh(!refresh);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium  rounded hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-sm">
                refresh
              </span>{" "}
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden group">
          <div className="carousel-viewport w-full h-full">
            {currentPage === "Overview" && (
              <EdaOverview
                rowSumaryStat={rowSumaryStat}
                info={info}
                chooseFeatureHandler={chooseFeatureHandler}
              ></EdaOverview>
            )}
            {currentPage === "Charts" && (
              <Charts datasetId={datasetId} typeList={typeList}></Charts>
            )}
            {currentPage === "Inspector" && (
              <RawDataInspector
                expand={expand}
                expandHandler={expandHandler}
                datasetId={datasetId}
                columns={Object.keys(info.columns)}
                refresh={refresh}
              ></RawDataInspector>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default EdaCarousel;
