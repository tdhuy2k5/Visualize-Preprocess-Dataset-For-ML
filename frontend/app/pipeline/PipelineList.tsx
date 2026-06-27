import { type PipelineResponseType } from "~/api";
import EncodingStep from "./EncodingStep";
import TransformStep from "./TransformStep";
import EngineerStep from "./EngineerStep";
import ImbalancedStep from "./ImbalanceStep";

export function PipelineList({
  pipeline,
  deleteHandler,
}: {
  pipeline: PipelineResponseType;
  deleteHandler: (i: number) => void;
}) {
  return (
    <div className="bg-surface-container rounded-xl p-6 border border-white/5 min-h-[calc(5*5rem)] max-h-[20vh] overflow-y-auto">
      <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">account_tree</span>
        Pipeline
      </h4>

      <div className="space-y-2">
        {pipeline.length === 0 && (
          <div className="p-2 text-xs text-slate-400">No steps yet</div>
        )}

        {pipeline.map((step, i) => {
          switch (step.type) {
            case "encoding":
              return (
                <EncodingStep
                  item={step.data}
                  onRemove={() => deleteHandler(i)}
                ></EncodingStep>
              );
            case "transform":
              return (
                <TransformStep
                  step={step.data}
                  onRemove={() => deleteHandler(i)}
                ></TransformStep>
              );
            case "engineer":
              return (
                <EngineerStep
                  step={step.data}
                  onRemove={() => deleteHandler(i)}
                ></EngineerStep>
              );
            case "imbalance":
              return (
                <ImbalancedStep
                  item={step.data}
                  onRemove={() => deleteHandler(i)}
                ></ImbalancedStep>
              );
          }
        })}
      </div>
    </div>
  );
}
