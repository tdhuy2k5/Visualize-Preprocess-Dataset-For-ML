import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { formatHistogramChart } from "./helper";
import { initChartStyle } from "./styles";
import { getHistogramChart, type histogramChartType } from "./api";

const HistogramChart = function ({
  columnName,
  datasetId,
  max,
}: {
  columnName: string | undefined;
  datasetId: string | undefined;
  max: number;
}) {
  const chartRef = useRef(null);
  const [histogramChart, setHistogramChart] =
    useState<histogramChartType | null>(null);
  useEffect(() => {
    async function fetchData() {
      if (!columnName || !datasetId) {
        return;
      }
      const data = await getHistogramChart(columnName, datasetId);
      if (data) {
        setHistogramChart(data);
      }
    }
    fetchData();
  }, [datasetId, columnName]);

  useEffect(() => {
    const chartStyle = initChartStyle();
    const chart = echarts.init(chartRef.current);
    const option = {
      tooltip: {},
      grid: [{ top: 20, left: 0, right: 0 }],
      xAxis: [
        {
          type: "category",
          scale: true,
          axisLabel: {
            interval: 1,
            color: chartStyle.fontColor,
            fontFamily: chartStyle.fontFamily,
            fontSize: chartStyle.fontSize,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            show: false,
          },
          axisLine: { show: false },
          splitLine: { show: false },
        },
      ],
      visualMap: {
        min: 0,
        max: max / 3,
        inRange: {
          color: chartStyle.itemColor,
        },
        show: false,
      },
      series: [
        {
          name: "histogram",
          type: "bar",
          label: {
            show: true,
            position: "top",
            color: chartStyle.fontColor,
            fontFamily: chartStyle.fontFamily,
            fontSize: chartStyle.fontSize,
          },
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
          },
          data: formatHistogramChart(histogramChart),
        },
      ],
    };
    chart.setOption(option);
    return () => {
      chart.dispose();
    };
  }, [histogramChart]);

  return <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>;
};
export default HistogramChart;
