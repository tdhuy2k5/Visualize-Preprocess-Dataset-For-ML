import { useState } from "react";
import BaseExpression from "./builder/BaseExpression";
import WrapFunction, { type Func } from "./builder/WrapFunction";
import PreviewExpression from "./builder/PreviewExpression";
import ColumnNameInput from "./builder/ColumnNameInput";
import { featureEngineering, type FeatureEngRequest } from "./api";
export type Expression = {
  newColName: string;
  baseExpr: string;
  wrapFunctions: Func[];
};
const CustomExpressionBuilder = function ({
  datasetId,
  columns,
  refreshHandler,
}: {
  datasetId: string;
  columns: string[];
  refreshHandler: VoidFunction;
}) {
  const [expr, setExpr] = useState<Expression>({
    newColName: "new col",
    baseExpr: "",
    wrapFunctions: [],
  });
  function setBaseExpr(baseExpr: string) {
    setExpr({ ...expr, baseExpr });
  }
  function setWrapFunctions(wrapFunctions: Func[]) {
    setExpr({ ...expr, wrapFunctions });
  }
  function setNewColName(newColName: string) {
    setExpr({ ...expr, newColName });
  }
  function buildExpression(): string {
    let s = expr.baseExpr;
    for (let i = 0; i < expr.wrapFunctions.length; i++) {
      const fn = expr.wrapFunctions[i];
      s = `@${fn.type}( ${s}, ${fn.param})`;
    }
    return s;
  }
  async function executeOperation() {
    const req: FeatureEngRequest = {
      operation: "expression",
      new_col: expr.newColName,
      params: {
        expression: buildExpression(),
      },
    };
    await featureEngineering(datasetId, req);
    refreshHandler();
  }
  return (
    <>
      <ColumnNameInput
        value={expr.newColName}
        onChange={setNewColName}
      ></ColumnNameInput>
      <BaseExpression
        columns={columns}
        setBaseExpr={setBaseExpr}
      ></BaseExpression>
      <WrapFunction setWrapFunctions={setWrapFunctions}></WrapFunction>

      <PreviewExpression expr={buildExpression()}></PreviewExpression>

      <div className="pt-6 border-t border-outline-variant/10 flex items-center justify-between flex-row-reverse">
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 text-secondary hover:bg-surface-variant/30 rounded-lg transition-all font-semibold text-sm">
            Cancel
          </button>
          <button
            onClick={() => executeOperation()}
            className="px-8 py-2.5 bg-linear-to-r from-primary to-on-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all text-sm"
          >
            Execute Expression
          </button>
        </div>
      </div>
    </>
  );
};
export default CustomExpressionBuilder;
