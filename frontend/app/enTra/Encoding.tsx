import { EncodingMethod } from "./api";
import type { PipelineStepType } from "../pipeline/PipelineStepType";
import type { EncodingMethodType } from "./api";
const Encoding = function ({
  encodingHandler,
  pipeline,
  selectedFeature,
}: {
  encodingHandler: (method: EncodingMethodType, i: number) => void;
  pipeline: PipelineStepType[];
  selectedFeature: string;
}) {
  return (
    <div className="p-6 bg-surface-container rounded-xl border-t-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-xl">
            dataset
          </span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Categorical Encoding</h3>
          <p className="text-[11px] text-on-surface-variant">
            Convert strings to machine-readable vectors
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Encoding Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EncodingMethod.map((method) => {
              const index = pipeline.findIndex(
                (step) =>
                  step.type === "encoding" &&
                  step.data.column === selectedFeature &&
                  step.data.method === method.toLowerCase(),
              );
              return (
                <button
                  className={`px-3 py-2 text-[10px] font-bold rounded border border-outline-variant/10 transition-colors ${index !== -1 ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant/40"} `}
                  onClick={() => encodingHandler(method, index)}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-3 bg-surface-container-lowest rounded-md border border-outline-variant/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-on-surface-variant font-medium">
              Drop First Category
            </span>
            <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-primary-container rounded-full"></div>
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant/60">
            Reduces multicollinearity in linear models by dropping the reference
            level.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Encoding;
