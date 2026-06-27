import { useEffect, useRef, useState } from "react";
import { initChartStyle } from "./styles";
import * as echarts from "echarts";
import { getKdeChart, type kdeChartType } from "./api";

const KdeChart = function ({
  columnName,
  datasetId,
}: {
  columnName: string;
  datasetId: string;
}) {
  const chartRef = useRef(null);
  const [kdeChart, setKdeChart] = useState<kdeChartType>({ points: [[0, 0]] });
  useEffect(() => {
    async function fetchData() {
      if (columnName) {
        const data = await getKdeChart(datasetId, columnName);
        if (data) {
          setKdeChart(data);
        }
      }
    }
    fetchData();
  }, [datasetId, columnName]);
  useEffect(() => {
    const chartStyle = initChartStyle();
    const chart = echarts.init(chartRef.current);

    const option = {
      grid: [{ top: 20, left: 0, right: 0 }],

      xAxis: [
        {
          type: "value",
          scale: true,
          axisLabel: {
            interval: 1,
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
      ],

      yAxis: [
        {
          type: "value",
          axisLabel: {
            interval: 1,
            color: chartStyle.fontColor,
            fontFamily: chartStyle.fontFamily,
            fontSize: chartStyle.fontSize,
          },
          axisLine: { show: false },
          splitLine: { show: false },
        },
      ],

      series: [
        {
          name: "line",
          type: "line",
          smooth: true,

          data: kdeChart.points,
          symbol: "circle",
          symbolSize: 6,

          lineStyle: {
            width: 2,
          },

          itemStyle: {
            color: chartStyle.itemColor[0], // use first color
          },

          areaStyle: {
            opacity: 0.15, // soft fill under line (optional but nice)
          },
        },
      ],
    };
    chart.setOption(option);
    return () => {
      chart.dispose();
    };
  }, [kdeChart]);
  return <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>;
};
export default KdeChart;
