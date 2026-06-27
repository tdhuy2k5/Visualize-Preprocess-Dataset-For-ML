import { useState } from "react";
import { useParams } from "react-router";
import { useDataset } from "~/customHooks/useDataset";
import EdaCarousel from "~/eda/EdaCarousel";
import ColumnOps from "~/FeatEngin/ColumnOps";
import { Options } from "~/FeatEngin/EngineerOptions";
import CustomExpressionBuilder from "~/FeatEngin/CustomExpressionBuilder";
import OperationsList from "~/FeatEngin/OperationsList";
import GroupBy from "~/FeatEngin/GroupBy";
import { PipelineList } from "~/pipeline/PipelineList";
import { usePipeline } from "~/customHooks/usePipeline";
import HeaderPreprocessing from "~/components/HeaderPreprocessing";

const FeatureEngineer = function () {
  const datasetId = useParams()?.datasetId ?? "";
  const { info } = useDataset(datasetId);
  const { pipeline, refreshHandler, deleteHandler } = usePipeline(datasetId);
  const [selectedOption, setSelectedOption] = useState<string>(Options[0].name);
  function selectOptionHandler(option: string) {
    setSelectedOption(option);
  }

  return (
    <main className="flex h-screen overflow-hidden">
      <section className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-surface-dim">
        <HeaderPreprocessing
          title="Feature Engineer"
          desc="Design complex feature transformations by combining raw data columns, mathematical operators, and high-fidelity functions."
          nextStep={`/imbalance/${datasetId}`}
          stepNumber={2}
        ></HeaderPreprocessing>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <OperationsList
              selectOptionHandler={selectOptionHandler}
            ></OperationsList>
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h4 className="text-xs font-bold text-white mb-2 relative z-10">
                Technical Quick-Tip
              </h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed relative z-10">
                Use the <code className="text-primary-fixed-dim">sqrt()</code>{" "}
                function to normalize skewed variance in heavy price-action
                datasets.
              </p>
            </div>
            <PipelineList
              deleteHandler={deleteHandler}
              pipeline={pipeline}
            ></PipelineList>
          </div>
          <div className="col-span-9 space-y-6">
            <div className="bg-surface-container rounded-xl p-8 border border-outline-variant/5">
              {selectedOption === "Custom Expression" && (
                <CustomExpressionBuilder
                  datasetId={datasetId}
                  columns={Object.keys(info.columns)}
                  refreshHandler={refreshHandler}
                ></CustomExpressionBuilder>
              )}
              {selectedOption === "Column Ops" && (
                <ColumnOps
                  datasetId={datasetId}
                  columns={Object.keys(info.columns)}
                  refreshHandler={refreshHandler}
                ></ColumnOps>
              )}
              {selectedOption === "Group By" && (
                <GroupBy
                  datasetId={datasetId}
                  columns={Object.keys(info.columns)}
                  refreshHandler={refreshHandler}
                ></GroupBy>
              )}
            </div>
          </div>
          <div className="col-span-12 space-y-6">
            <EdaCarousel datasetId={datasetId}></EdaCarousel>
          </div>
        </div>
      </section>
    </main>
  );
};
export default FeatureEngineer;
