import { useState } from "react";
import { chartList } from "./chartList";

const ChartDropdown = function ({
  selectedChart,
  chooseChartHandler,
}: {
  selectedChart: string;
  chooseChartHandler: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedChartProps = chartList.find((e) => e.name === selectedChart);

  return (
    <aside className="relative w-full md:w-64 bg-surface-container border-r border-outline-variant/10 p-6 flex flex-col gap-6">
      <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">tune</span> Chart
        Selection{" "}
      </h4>

      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-xs"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {selectedChartProps?.icon}
          </span>
          <h3 className="text-on-surface-variant text-xs uppercase font-bold tracking-">
            {selectedChart}
          </h3>
        </div>

        <span className="material-symbols-outlined text-on-surface-variant">
          {open ? "expand_less" : "expand_more"}
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <nav
          className="absolute top-full left-0 mt-2 w-full z-50
                 bg-surface-container rounded-xl shadow-lg
                 p-2 space-y-2"
        >
          {chartList.map((chart, i) => {
            const isActive = chart.name === selectedChart;

            return (
              <button
                key={i}
                onClick={() => {
                  chooseChartHandler(chart.name);
                  setOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 relative overflow-hidden ${
                  isActive
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-transparent hover:bg-surface-variant"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-primary"></div>
                )}

                {/* Icon */}
                <span
                  className={`material-symbols-outlined ${
                    isActive
                      ? "text-primary"
                      : "text-on-surface-variant group-hover:text-on-surface"
                  }`}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {chart.icon}
                </span>

                {/* Text */}
                <div>
                  <div
                    className={`text-xs font-semibold ${
                      isActive ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {chart.name}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      )}
    </aside>
  );
};
export default ChartDropdown;
