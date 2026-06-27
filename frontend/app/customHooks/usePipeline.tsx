import { useEffect, useState } from "react";
import {
  deleteStepPipeline,
  getPipeline,
  type PipelineResponseType,
} from "~/api";

export function usePipeline(datasetId: string) {
  const [pipeline, setPipeline] = useState<PipelineResponseType>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const deleteHandler = async (index: number) => {
    const res = await deleteStepPipeline(datasetId, index);
    if (res) {
      setRefresh(!refresh);
    }
  };
  useEffect(() => {
    async function fetchData() {
      if (!datasetId) return;

      const data = await getPipeline(datasetId);

      if (data) {
        setPipeline(data);
      }
    }

    fetchData();
  }, [datasetId, refresh]);
  function refreshHandler() {
    setRefresh(!refresh);
  }
  return { pipeline, refreshHandler, deleteHandler };
}
