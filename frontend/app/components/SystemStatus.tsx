import { useEffect, useState } from "react";
import { getServerStatus, type serverStatusType } from "~/home/api";

const SystemStatus = function () {
  const [status, setStatus] = useState<serverStatusType | null>(null);
  useEffect(() => {
    let mounted = true;
    setTimeout(async function fetchData() {
      if (!mounted) {
        return;
      }
      const data = await getServerStatus();
      if (!data && !status) {
        setStatus(null);
      } else if (data) {
        setStatus(data);
        setTimeout(fetchData, 10 * 1000);
      }
    }, 10 * 1000);
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="fixed bottom-6 right-8 glass-panel border border-white/10 rounded-full px-4 py-2 flex items-center gap-6 shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          System Optimal
        </span>
      </div>
      <div className="h-4 w-px bg-white/10"></div>
      <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">memory</span>{" "}
          {`${status?.ram ?? "--"}%`}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">database</span>{" "}
          {`${status?.storage ?? "--"}/1GB`}
        </span>
      </div>
    </div>
  );
};
export default SystemStatus;
