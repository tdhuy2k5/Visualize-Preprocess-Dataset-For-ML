import { useEffect, useRef, useState } from "react";
import { initChartStyle } from "./styles";
import * as echarts from "echarts";
import { getScatterPlot, type scatterPlotType } from "./api";

const ScatterPlot = function ({
  subset,
  datasetId,
}: {
  subset: [string, string];
  datasetId: string;
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [scatterData, setScatterData] = useState<scatterPlotType>({
    points: [[0, 0]],
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getScatterPlot(datasetId, subset);
      if (data) {
        setScatterData(data);
      }
    }
    fetchData();
  }, [datasetId, subset]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartStyle = initChartStyle();
    const chart = echarts.init(chartRef.current);

    const option = {
      grid: [{ top: 20, left: 40, right: 20, bottom: 40 }],
      large: true,

      xAxis: {
        type: "value",
        scale: true,
        name: subset[0],
        axisLabel: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
        axisLine: {
          lineStyle: {
            color: chartStyle.fontColor,
          },
        },
      },

      yAxis: {
        type: "value",
        scale: true,
        name: subset[1],
        axisLabel: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
        axisLine: { show: false },
        splitLine: { show: false },
      },

      series: [
        {
          name: "scatter",
          type: "scatter",
          data: scatterData.points,

          symbol: "circle",
          symbolSize: 8,

          itemStyle: {
            color: chartStyle.itemColor[0],
            opacity: 0.7,
          },
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [scatterData, subset]);

  return <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>;
};

export default ScatterPlot;
