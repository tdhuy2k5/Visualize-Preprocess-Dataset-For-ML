import { useState } from "react";
import { useParams } from "react-router";
import HeaderPreprocessing from "~/components/HeaderPreprocessing";
import { useDataset } from "~/customHooks/useDataset";
import { usePipeline } from "~/customHooks/usePipeline";
import { createTypeList } from "~/eda/charts/helper";
import EdaCarousel from "~/eda/EdaCarousel";
import FeatureSelection from "~/eda/FeatureSelection";
import {
  imbalanced,
  type ImbalancedMethod,
  ImbalancedRequest,
} from "~/imbalance/api";
import MethodOptions from "~/imbalance/MethodOptions";
import { PipelineList } from "~/pipeline/PipelineList";

const Imbalance = function () {
  const datasetId = useParams()?.datasetId ?? "";
  const { info, chooseFeatureHandler } = useDataset(datasetId);
  const { pipeline, refreshHandler, deleteHandler } = usePipeline(datasetId);
  const [method, setMethod] = useState<ImbalancedMethod>("smote");
  const typeList = createTypeList(info.columns);
  const selectedColumn =
    Object.keys(info.columns).find(
      (key) => info?.columns[key].selected === true,
    ) ?? "";
  async function executeOperation() {
    if (!method) {
      return;
    } else {
      const req = new ImbalancedRequest(selectedColumn, method);
      await imbalanced(datasetId, req);
      refreshHandler();
    }
  }
  function methodChangeHandler(method: ImbalancedMethod) {
    setMethod(method);
  }

  return (
    <main className=" flex-1 p-8 min-h-screen bg-surface-dim">
      <div className=" space-y-8">
        <HeaderPreprocessing
          title="Handling Imbalanced Data"
          desc="Refine your dataset distribution to ensure minor classes are accurately represented during model training."
          nextStep={`/model-training/${datasetId}`}
          stepNumber={3}
        ></HeaderPreprocessing>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <PipelineList
              pipeline={pipeline}
              deleteHandler={deleteHandler}
            ></PipelineList>
          </div>
          <div className="lg:col-span-8 bg-surface-container rounded-xl p-8 border-none relative overflow-hidden flex flex-col h-150">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">
                tune
              </span>
              <h2 className="text-xl font-bold font-headline text-white">
                Resampling Configuration
              </h2>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-6 flex-1 min-h-0">
              <div className="min-h-0 overflow-y-auto row-end-1 pr-2">
                <FeatureSelection
                  typeLists={typeList}
                  chooseHandler={chooseFeatureHandler}
                  selectedFeature={selectedColumn}
                />
              </div>

              {/* RIGHT */}
              <div className="space-y-3">
                <MethodOptions
                  method={method}
                  methodChangeHandler={methodChangeHandler}
                />
              </div>

              {/* BUTTON spans both */}
              <button
                onClick={executeOperation}
                className="col-span-2 w-full bg-linear-to-r from-primary to-on-primary-container text-on-primary font-bold py-4 rounded-lg shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98] duration-200"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_fix_high
                </span>
                Apply Resampling
              </button>
            </div>
          </div>{" "}
        </div>
        <EdaCarousel datasetId={datasetId}></EdaCarousel>
      </div>
    </main>
  );
};
export default Imbalance;
