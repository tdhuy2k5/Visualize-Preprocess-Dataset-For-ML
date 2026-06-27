import { useCallback, useEffect, useRef, useState } from "react";
import { useRowsHook } from "./useRowsHook";

const RawDataInspector = function ({
  datasetId,
  columns,
  expand,
  expandHandler,
  refresh,
}: {
  datasetId: string;
  columns: string[];
  expand: boolean;
  expandHandler: () => boolean;
  refresh: boolean;
}) {
  const [newPage, setNewPage] = useState(0);
  const { rows, loading } = useRowsHook(expand, datasetId, newPage, refresh);
  const observer = useRef<IntersectionObserver>(null);
  const lastRowRef = useCallback(
    (e: HTMLTableRowElement) => {
      if (!expand || loading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && rows.offset != rows.count) {
          setNewPage(newPage + 1);
        }
      });
      if (e) observer.current.observe(e);
    },
    [expand, loading],
  );
  return (
    <div
      className={`${
        expand
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          : ""
      }`}
    >
      <div
        className={`bg-surface-container-low rounded-xl border border-white/5 overflow-y-hidden overflow-x-scroll
    ${expand ? "w-[90vw] h-[90vh] shadow-2xl" : "h-100"}
  `}
      >
        <div className="px-6 py-4 flex justify-between items-center bg-surface-container-high/50">
          <h4 className="text-sm font-bold text-white">Raw Data Inspector</h4>
          <button>
            <span
              className="material-symbols-outlined text-xs hover:text-primary"
              onClick={() => {
                expandHandler();
              }}
            >
              {expand ? "expand_circle_down" : "expand_circle_up"}
            </span>
          </button>
          <div className="flex gap-4">
            <span className="text-[10px] text-on-surface-variant font-mono">
              {rows.rows.length} of {rows.count}
            </span>
          </div>
        </div>
        <div
          className={`overflow-auto custom-scrollbar ${
            expand
              ? "h-[calc(90vh-80px)]"
              : "overflow-y-hidden overflow-x-scroll"
          }`}
        >
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low border-b border-white/5">
              <tr>
                {columns.map((e) => (
                  <th
                    key={e}
                    className="sticky top-0 px-6 py-3 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant"
                  >
                    {e}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.rows.map((row, i) =>
                i === rows.rows.length - 1 ? (
                  <tr
                    key={i}
                    ref={lastRowRef}
                    className="hover:bg-surface-bright/40 transition-colors"
                  >
                    {row.map((data, i) =>
                      typeof data === "string" ? (
                        <td
                          key={i}
                          className="px-6 py-4 font-mono text-[11px] text-primary"
                        >
                          {data}
                        </td>
                      ) : (
                        <td
                          key={i}
                          className="px-6 py-4 tabular-nums text-[13px] text-white"
                        >
                          {data}
                        </td>
                      ),
                    )}
                  </tr>
                ) : (
                  <tr
                    key={i}
                    className="hover:bg-surface-bright/40 transition-colors"
                  >
                    {row.map((data, i) =>
                      typeof data === "string" ? (
                        <td
                          key={i}
                          className="px-6 py-4 font-mono text-[11px] text-primary"
                        >
                          {data}
                        </td>
                      ) : (
                        <td
                          key={i}
                          className="px-6 py-4 tabular-nums text-[13px] text-white"
                        >
                          {data}
                        </td>
                      ),
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default RawDataInspector;
