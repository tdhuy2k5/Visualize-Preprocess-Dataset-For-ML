import { useEffect, useState } from "react";
import { getRows } from "./api";

export function useRowsHook(
  expand: boolean,
  datasetId: string,
  newPage: number,
  refresh: boolean,
) {
  type dataset = {
    rows: (number | string)[][];
    offset: number;
    count: number;
  };
  const [rows, setRows] = useState<dataset>({ rows: [], offset: 0, count: 10 });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getRows(datasetId, expand ? 20 : 5, rows.offset);
      if (data) {
        setRows({
          rows: rows.offset === 0 ? data.rows : [...rows.rows, ...data.rows],
          offset: expand ? 20 + rows.offset : 0,
          count: data.count,
        });
        setLoading(false);
      }
    }
    fetchData();
  }, [expand, newPage, refresh]);

  return { rows, loading };
}
