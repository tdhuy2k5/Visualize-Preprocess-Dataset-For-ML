import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import { formatMatrix, getCssVar } from "./helper";
import { initChartStyle } from "./styles";
import { getHeatMap, type heatMapType } from "./api";
const HeatMap = function ({
  subset,
  datasetId,
}: {
  subset: string[] | undefined;
  datasetId: string | undefined;
}) {
  const chartRef = useRef(null);
  const [heatMap, setHeatMap] = useState<heatMapType | null>(null);
  useEffect(() => {
    async function fetchData() {
      if (!subset || !datasetId) {
        return;
      }
      const data = await getHeatMap(subset, datasetId);
      if (data) {
        setHeatMap(data);
      }
    }
    fetchData();
  }, [datasetId, subset]);
  useEffect(() => {
    const chartStyle = initChartStyle();
    let option = {
      tooltip: {
        position: "top",
      },
      grid: {
        height: "70%",
        top: 0,
        left: 0,
        right: 0,
      },
      xAxis: {
        type: "category",
        data: heatMap?.labels,
        axisLabel: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: heatMap?.labels,
        inverse: true,
        axisLabel: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: Math.min(...(heatMap?.matrix.flat() ?? [0])) - 0.3,
        max: Math.max(...(heatMap?.matrix.flat() ?? [0])) + 0.3,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "10%",
        inRange: {
          color: chartStyle.itemColor,
        },
        textStyle: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
      },
      series: [
        {
          name: "Punch Card",
          type: "heatmap",
          data: formatMatrix(heatMap?.matrix ?? null),
          label: {
            show: true,
            color: chartStyle.fontColor,
            textBorderColor: getCssVar("--color-surface-container-low"),
            textBorderWidth: 2,
            fontFamily: chartStyle.fontFamily,
            fontSize: chartStyle.fontSize,
          },
          itemStyle: {
            borderColor: getCssVar("--color-surface-container-low"),
            borderWidth: 5,
            borderRadius: 5,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    const chart = echarts.init(chartRef.current);
    chart.setOption(option);
    return () => {
      chart.dispose();
    };
  }, [heatMap]);
  return <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>;
};
export default HeatMap;
