import { useEffect, useState } from "react";
import { getColumnsInfo, type columnsInfo } from "~/eda/api";

export function useDataset(datasetId: string) {
  const [info, setInfo] = useState<columnsInfo>({ shape: [0, 0], columns: {} });
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getColumnsInfo(datasetId);
      if (data) {
        Object.values(data.columns).forEach((c, i) => {
          if (i === 0) {
            c.selected = true;
          } else {
            c.selected = false;
          }
        });
        setInfo(data);
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);
  function chooseFeatureHandler(name: string | undefined) {
    if (!info || !name) {
      return;
    }
    Object.keys(info.columns).forEach((key) => {
      if (key === name) {
        info.columns[key].selected = true;
      } else {
        info.columns[key].selected = false;
      }
    });
    setInfo({ ...info, columns: { ...info.columns } });
  }
  function refreshHandler() {
    setRefresh(!refresh);
  }
  return { info, chooseFeatureHandler, loading, refreshHandler };
}
