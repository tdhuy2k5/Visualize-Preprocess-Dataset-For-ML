import { useState } from "react";
import {
  transform,
  TransformationRequest,
  type TransformationMethodType,
} from "./api";

type Props = {
  datasetId: string;
  selectedColumns: string[]; // allow multi-select
  refresh: () => void;
};

const Transforming = function ({ datasetId, selectedColumns, refresh }: Props) {
  const [loading, setLoading] = useState(false);

  const handleTransform = async (method: TransformationMethodType) => {
    if (!selectedColumns.length) return;

    setLoading(true);

    await transform(
      datasetId,
      new TransformationRequest(method, selectedColumns),
    );

    setLoading(false);
    refresh();
  };

  return (
    <div className="p-6 bg-surface-container rounded-xl border-t-2 border-tertiary/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-tertiary text-xl">
            straighten
          </span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Numeric Scaling</h3>
          <p className="text-[11px] text-on-surface-variant">
            Normalize feature distributions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Scaling */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Scaling Algorithm
          </label>

          <select
            disabled={loading}
            onChange={(e) => {
              const map: Record<string, TransformationMethodType> = {
                standard: "standard",
                minmax: "minmax",
                robust: "robust",
                normalize: "normalize",
              };

              handleTransform(map[e.target.value]);
            }}
            className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-md px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-tertiary/40"
          >
            <option value="">Select...</option>
            <option value="standard">StandardScaler (Z-Score)</option>
            <option value="minmax">MinMaxScaler (0-1)</option>
            <option value="robust">RobustScaler (Interquartile)</option>
            <option value="normalize">Normalize</option>
          </select>
        </div>

        {/* Power transforms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Power Transform
            </label>

            <div className="flex gap-2">
              <button
                disabled={loading}
                onClick={() => handleTransform("log")}
                className="flex-1 py-1.5 text-[10px] font-bold rounded bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-white transition-colors"
              >
                Log
              </button>

              <button
                disabled={loading}
                onClick={() => handleTransform("sqrt")}
                className="flex-1 py-1.5 text-[10px] font-bold rounded bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-white transition-colors"
              >
                Sqrt
              </button>
            </div>
          </div>

          {/* Optional: map "clip" later if backend supports */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Outliers
            </label>

            <button
              disabled
              className="w-full py-1.5 text-[10px] font-bold rounded bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant opacity-50 cursor-not-allowed"
            >
              Clip (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Transforming;
