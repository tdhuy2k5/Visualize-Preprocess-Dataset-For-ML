import { useEffect, useState } from "react";

const BaseExpression = function ({
  columns,
  setBaseExpr,
}: {
  columns: string[];
  setBaseExpr: (baseExpr: string) => void;
}) {
  const ops = ["*", "/", "%", "+", "-"];

  type Expression = {
    left: string;
    op: string;
    right: string;
  };

  const [expr, setExpr] = useState<Expression>({
    left: columns[0] || "",
    op: ops[0],
    right: columns[1] || columns[0] || "",
  });
  useEffect(() => {
    setBaseExpr(`#${expr.left} ${expr.op} #${expr.right}`);
  }, [expr]);
  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-base">input</span>
          Base Expression
        </h2>

        <div className="grid grid-cols-3 gap-4 bg-surface-container-low p-6 rounded-xl">
          {/* LEFT OPERAND */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">
              Left Operand
            </label>
            <div className="relative">
              <select
                value={expr.left}
                onChange={(e) =>
                  setExpr((prev) => ({ ...prev, left: e.target.value }))
                }
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-primary transition-colors"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* OPERATOR */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">
              Operator
            </label>
            <div className="relative">
              <select
                value={expr.op}
                onChange={(e) =>
                  setExpr((prev) => ({ ...prev, op: e.target.value }))
                }
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-primary transition-colors"
              >
                {ops.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* RIGHT OPERAND */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">
              Right Operand
            </label>
            <div className="relative">
              <select
                value={expr.right}
                onChange={(e) =>
                  setExpr((prev) => ({ ...prev, right: e.target.value }))
                }
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-primary transition-colors"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseExpression;
