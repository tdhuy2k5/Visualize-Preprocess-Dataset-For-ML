import type { FeatureEngRequest } from "~/FeatEngin/api";

const EngineerStep = function ({
  step,
  onRemove,
}: {
  step: FeatureEngRequest;
  onRemove?: () => void;
}) {
  const isExpression = step.operation === "expression";
  const isGroupby = step.operation === "groupby_agg";

  const icon = isExpression ? "function" : "group_work";
  const color = isExpression ? "text-primary" : "text-secondary";
  const title = isExpression ? "Expression" : "Groupby Agg";

  return (
    <div className="relative group flex items-start gap-4">
      {/* Icon */}
      <div
        className={`z-10 w-10 h-10 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center shrink-0 ${color}`}
      >
        <span className="material-symbols-outlined text-sm">{icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            {title}
          </h4>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="material-symbols-outlined text-xs text-on-surface-variant hover:text-error"
            >
              close
            </button>
          </div>
        </div>

        {/* Expression */}
        {isExpression && (
          <div className="mt-1 bg-surface-container-lowest p-2 rounded border border-outline-variant/10">
            <code className="text-[10px] text-primary block break-all font-mono">
              {step.params.expression}
            </code>
          </div>
        )}

        {/* Groupby */}
        {isGroupby && (
          <p className="text-on-surface-variant text-[11px] mt-0.5">
            {formatGroupby(step)}
          </p>
        )}
      </div>
    </div>
  );
};

// helper
function formatGroupby(
  step: Extract<FeatureEngRequest, { operation: "groupby_agg" }>,
) {
  const { agg_func = "sum", agg_col, group_col } = step.params;

  return `${capitalize(agg_func)} of '${agg_col}' by '${group_col.join(", ")}'`;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default EngineerStep;
