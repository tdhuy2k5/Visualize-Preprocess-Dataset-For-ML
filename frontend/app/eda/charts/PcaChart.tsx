import { useEffect, useRef, useState } from "react";
import { getPcaChart, type pcaChartType } from "./api";
import { initChartStyle } from "./styles";
import * as echarts from "echarts";
import { getCssVar, rangingColor } from "./helper";

const PcaChart = function ({ datasetId }: { datasetId: string }) {
  const chartRef = useRef(null);
  const [pcaChart, setPcaChart] = useState<pcaChartType>({
    explained_variance: [0],
    points: [[0, 0, 0]],
    total_variance: 0,
  });
  useEffect(() => {
    async function fetchData() {
      if (datasetId === "") {
        return;
      }
      const data = await getPcaChart(datasetId);
      if (data) {
        setPcaChart(data);
      }
    }
    fetchData();
  }, [datasetId]);
  useEffect(() => {
    const labels = [...new Set(pcaChart.points.map((p) => p[2]))];
    const chartStyle = initChartStyle();
    let option = {
      tooltip: {
        show: false,
      },
      grid: {
        height: "70%",
        top: 0,
        left: 0,
        right: 0,
      },
      xAxis: {
        axisLabel: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
        axisLine: {
          lineStyle: {
            color: getCssVar("--color-error"),
          },
        },
      },
      yAxis: {
        axisLabel: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
        axisLine: {
          lineStyle: {
            color: getCssVar("--color-error"),
          },
        },
      },
      visualMap: {
        type: "piecewise",
        dimension: 2,
        calculable: true,
        orient: "horizontal",
        left: "center",
        categories: labels,
        inRange: {
          color: rangingColor(
            getCssVar("--color-primary"),
            getCssVar("--color-error"),
            labels.length,
          ),
        },
        textStyle: {
          color: chartStyle.fontColor,
          fontFamily: chartStyle.fontFamily,
          fontSize: chartStyle.fontSize,
        },
      },
      series: [
        {
          name: "punch card",
          type: "scatter",
          large: true,
          data: pcaChart.points,
          label: {
            color: chartStyle.fontColor,
            fontFamily: chartStyle.fontFamily,
            fontSize: chartStyle.fontSize,
          },
          itemstyle: {
            color: getCssVar("--color-surface-container-low"),
            borderColor: getCssVar("--color-surface-container-low"),
          },
          emphasis: {
            itemstyle: {
              shadowBlur: 10,
              symbolSize: 30,
              shadowcolor: "rgba(0, 0, 0, 0.5)",
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
  }, [pcaChart]);
  return <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>;
};
export default PcaChart;
