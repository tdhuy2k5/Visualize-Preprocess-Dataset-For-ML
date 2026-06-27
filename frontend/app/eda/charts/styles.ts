import { getCssVar } from "./helper";
export function initChartStyle() {
  return {
    itemColor: [getCssVar("--color-primary"), getCssVar("--color-error")],
    fontColor: getCssVar("--color-on-surface-variant"),
    fontFamily: getCssVar("--font-mono"),
    fontSize: "10px",
  };
}
