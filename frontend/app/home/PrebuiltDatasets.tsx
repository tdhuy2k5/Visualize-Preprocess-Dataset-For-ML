import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPrebuiltDatasets } from "./api";
import type { prebuiltDatasetType } from "./api";
const PrebuiltDatasets = function () {
  const [prebuiltDataset, setPrebuiltDataset] = useState<
    prebuiltDatasetType[] | null
  >(null);
  useEffect(() => {
    async function fetchData() {
      const data = await getPrebuiltDatasets();
      if (!data) {
        setPrebuiltDataset(null);
      } else {
        setPrebuiltDataset(data);
      }
    }
    fetchData();
  }, []);
  return prebuiltDataset ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {prebuiltDataset.map((dataset, i) => {
        const color = ["primary", "tertiary", "secondary"][i % 3];
        return (
          <Link
            to={`/encode&transform/${dataset.id}`}
            state={{ datasetId: dataset.id }}
            key={i}
            className="bg-surface-container-low rounded-xl p-6 border border-white/5 hover:bg-surface-container-high transition-all group cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <span className={`material-symbols-outlined text-${color}`}>
                {dataset.image}
              </span>
            </div>
            <h3 className="text-white font-bold text-base mb-2">
              {dataset.name}
            </h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              {dataset.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider">
              <span>Use Dataset</span>
              <span className="material-symbols-outlined text-xs">
                arrow_forward
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  ) : (
    <div className="text-center p-6">
      Something wrong with the server, please reload the page and pray
    </div>
  );
};
export default PrebuiltDatasets;
