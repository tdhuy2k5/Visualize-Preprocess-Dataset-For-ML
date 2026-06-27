import { useState } from "react";
import ChartDropdown from "./charts/ChartDropdown";
import FeatureDropdown from "./charts/FeatureDropdown";
import { chartList, type plotType } from "./charts/chartList";
import MultipleFeatureDropdown from "./charts/MultipleFeatureDropdown";
const Charts = function ({
  datasetId,
  typeList,
}: {
  datasetId: string;
  typeList: { name: string; type: string }[];
}) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedChart, setSelectedChart] = useState<string>("Scatter Plot");
  const selectedChartProps: plotType | undefined = chartList.find(
    (e) => e.name === selectedChart,
  );
  const propBuilders: Record<number, () => object> = {
    2: () => ({
      subset: [selectedFeatures[0], selectedFeatures[1]],
      datasetId,
    }),
    1: () => ({
      columnName: selectedFeatures[0],
      max: 100,
      datasetId,
    }),
    0: () => ({
      datasetId,
    }),
    [-1]: () => ({
      subset: selectedFeatures,
      datasetId,
    }),
  };

  const passedProps = selectedChartProps
    ? propBuilders[selectedChartProps.requiredColumn]()
    : {};
  function chooseChartHandler(name: string) {
    setSelectedChart(name);
  }
  function renderFeatureDropdown(chart: plotType | undefined) {
    if (!chart) {
      return;
    }
    if (chart.requiredColumn === -1) {
      let chooseFeatureHandlers = function (names: string[]) {
        setSelectedFeatures(names);
      };
      return (
        <MultipleFeatureDropdown
          selectedFeatures={selectedFeatures}
          typeLists={typeList}
          updateHandler={chooseFeatureHandlers}
        ></MultipleFeatureDropdown>
      );
    }

    let chooseFeatureHandlers = [];
    for (let i = 0; i < chart.requiredColumn; i++) {
      chooseFeatureHandlers.push((name: string) => {
        setSelectedFeatures((prev: string[]) => {
          const copy = [...prev];
          copy[i] = name;
          return copy;
        });
      });
    }
    return chooseFeatureHandlers.map((chooseFeatureHandler, i) => (
      <FeatureDropdown
        typeLists={typeList}
        selectedFeature={selectedFeatures[i]}
        chooseHandler={(name: string | undefined) => {
          name && chooseFeatureHandler(name);
        }}
      ></FeatureDropdown>
    ));
  }
  return (
    <div className="carousel-slide custom-scrollbar">
      <div className="flex gap-5 p-5">
        <ChartDropdown
          selectedChart={selectedChart}
          chooseChartHandler={chooseChartHandler}
        ></ChartDropdown>
        {renderFeatureDropdown(chartList.find((e) => e.name === selectedChart))}
      </div>
      <div className="max-w-350 mx-auto">
        {selectedChartProps?.component(passedProps)}
      </div>
    </div>
  );
};
export default Charts;
