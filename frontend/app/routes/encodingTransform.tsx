import { useParams } from "react-router";
import type { Route } from "../+types/root";
import { useDataset } from "~/customHooks/useDataset";
import FeatureSelection from "~/eda/FeatureSelection";
import { createTypeList } from "~/eda/charts/helper";
import Encoding from "~/enTra/Encoding";
import {
  EncodingRequest,
  enconding,
  type EncodingMethodType,
} from "~/enTra/api";
import EdaCarousel from "~/eda/EdaCarousel";
import { PipelineList } from "~/pipeline/PipelineList";
import Transforming from "~/enTra/Transforming";
import { usePipeline } from "~/customHooks/usePipeline";
import HeaderPreprocessing from "~/components/HeaderPreprocessing";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Encoding and Transform" }];
}
const EncodingTransform = function () {
  const datasetId = useParams()?.datasetId ?? "";
  const { info, chooseFeatureHandler } = useDataset(datasetId);
  const { pipeline, refreshHandler, deleteHandler } = usePipeline(datasetId);
  const typeList = createTypeList(info.columns);
  const selectedColumn =
    Object.keys(info.columns).find(
      (key) => info?.columns[key].selected === true,
    ) ?? "";
  async function encodingHandler(method: EncodingMethodType, i: number) {
    const req = new EncodingRequest(method, {
      columns: Object.keys(info.columns),
      column: selectedColumn,
    });
    if (i !== -1) {
      deleteHandler(i);
    } else {
      try {
        await enconding(datasetId, req);
        refreshHandler();
      } catch {
        console.log("Error");
      }
    }
  }

  return (
    <>
      <main className="flex-1 relative overflow-hidden flex flex-col bg-surface-dim p-8">
        <HeaderPreprocessing
          title="Encoding &amp; Transformation"
          desc="Transform raw features into robust model inputs with configurable encoding, scaling, normalization, and preprocessing operations."
          nextStep={`/feature-engineer/${datasetId}`}
          stepNumber={1}
        ></HeaderPreprocessing>
        <div className="flex-1 grid grid-cols-12 gap-6 overflow-y-auto custom-scrollbar">
          <section className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <FeatureSelection
              typeLists={typeList}
              selectedFeature={selectedColumn}
              chooseHandler={chooseFeatureHandler}
            ></FeatureSelection>
            <PipelineList
              pipeline={pipeline}
              deleteHandler={deleteHandler}
            ></PipelineList>
          </section>

          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
            <div className="grid grid-rows-1 md:grid-rows-2 gap-6">
              <Encoding
                encodingHandler={encodingHandler}
                selectedFeature={selectedColumn}
                pipeline={pipeline}
              ></Encoding>

              <Transforming
                datasetId={datasetId}
                selectedColumns={Object.keys(info.columns)}
                refresh={refreshHandler}
              ></Transforming>
            </div>
          </div>
          <section className="col-span-12">
            <EdaCarousel datasetId={datasetId}></EdaCarousel>{" "}
          </section>
        </div>
      </main>
    </>
  );
};
export default EncodingTransform;
