import { useState } from "react";
import { Options } from "./EngineerOptions";
import TextOption from "./textOp/Options";
import { featureEngineering } from "./api";
export type ColOpType = {
  operations: string;
  column: string;
  new_col: string;
};
const ColumnOps = function ({
  datasetId,
  columns,
  refreshHandler,
}: {
  datasetId: string;
  columns: string[];
  refreshHandler: VoidFunction;
}) {
  function template() {
    return Options[0].children.reduce((r: Record<string, ColOpType>, op) => {
      return {
        ...r,
        [op.value]: {
          operations: op.value,
          column: "",
          new_col: "",
        },
      };
    }, {});
  }
  const [operations, setOperations] = useState(template);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  function updateOperationHandler(name: string) {
    return (c: string, nc: string) => {
      const op = {
        operations: name,
        column: c,
        new_col: nc,
      };
      setOperations({ ...operations, [op.operations]: op });
    };
  }
  async function executeOperation() {
    if (!activeOp) {
      return;
    }
    const req: any = operations[activeOp];
    if (!req || !req.column || !req.new_col) {
      return;
    }
    await featureEngineering(datasetId, req);
    refreshHandler();
  }
  return (
    <div className="flex-1 flex flex-col p-1 overflow-y-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-white tracking-tight">
            Custom Expression Builder
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Configure logic gates and text transformations for the preprocessing
            stream.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveOp(null);
            }}
            className="px-4 py-2 bg-surface-container-high rounded-md text-xs font-bold text-secondary hover:bg-surface-bright transition-colors"
          >
            CLEAR ALL
          </button>
          <button
            onClick={() => {
              executeOperation();
            }}
            className="px-4 py-2 bg-primary-container text-primary rounded-md text-xs font-bold border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            EXECUTE
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {Options[0].children.map((op, index, arr) => {
          const isLast = index === arr.length - 1;
          const isOdd = arr.length % 2 !== 0;
          const shouldSpan = isLast && isOdd;

          const isActive = activeOp === op.value;

          return (
            <div
              key={op.value}
              onClick={() => setActiveOp(op.value)}
              className={`
        cursor-pointer transition-all duration-200
        bg-surface-container-high rounded-xl p-6
        shadow-xl shadow-black/20 border-l-4

        ${shouldSpan ? "xl:col-span-2" : ""}

        ${
          isActive
            ? `border-${op.color} opacity-100 scale-[1.02]`
            : "border-outline-variant opacity-40 hover:opacity-70"
        }
      `}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={` w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center ${isActive ? `text-${op.color}` : "text-on-surface-variant"} `}
                >
                  <span className="material-symbols-outlined">{op.icon}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {op.name}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant font-label">
                    {op.description}
                  </p>
                </div>
              </div>

              <TextOption
                updateOperationHandler={updateOperationHandler(op.value)}
                columns={columns}
                isDisable={!isActive}
              ></TextOption>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ColumnOps;
